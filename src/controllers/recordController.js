const prisma = require("../config/db");
const AppError = require("../utils/AppError");

//Create Record 
exports.createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    if (!amount || !type || !category || !date) {
      return res.status(400).json({ message: "Required fields missing" });
    }
    
    if (amount <= 0) {
   throw new AppError("Amount must be greater than 0", 400);
}

if (!["INCOME", "EXPENSE"].includes(type)) {
  return res.status(400).json({ success: false, message: "Invalid type" });
}

if (isNaN(Date.parse(date))) {
  return res.status(400).json({ success: false, message: "Invalid date format" });
}
    
    const record = await prisma.record.create({
      data: {
        amount,
        type,
        category,
        date: new Date(date),
        notes,
        userId: req.user.userId,
      },
    });

   res.status(201).json({
  success: true,
  message: "Record created",
  data: record,
});
  } catch (error) {
    res.status(500).json({ success:false,
      error: error.message });
  }
};


//Get Records 
exports.getRecords = async (req, res, next) => {
  try {
    const {
      type,
      category,
      minAmount,
      maxAmount,
      startDate,
      endDate,
      search,
      sortBy = "date",
      order = "desc",
      page = 1,
      limit = 5,
    } = req.query;

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);

    
    if (isNaN(pageNumber) || isNaN(pageSize)) {
      return res.status(400).json({
        success: false,
        message: "Page and limit must be numbers",
      });
    }

    if (pageNumber < 1 || pageSize < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination values",
      });
    }

    
    const filters = {
      userId: req.user.userId,
      isDeleted:false,
      ...(type && { type }),
      ...(category && { category }),
      ...(minAmount && { amount: { gte: parseFloat(minAmount) } }),
      ...(maxAmount && {
        amount: {
          ...(minAmount && { gte: parseFloat(minAmount) }),
          lte: parseFloat(maxAmount),
        },
      }),
      ...(startDate || endDate
        ? {
            date: {
              ...(startDate && { gte: new Date(startDate) }),
              ...(endDate && { lte: new Date(endDate) }),
            },
          }
        : {}),
      ...(search && {
        OR: [
          { category: { contains: search, mode: "insensitive" } },
          { notes: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const skip = (pageNumber - 1) * pageSize;

    const totalRecords = await prisma.record.count({
      where: filters,
    });

    const records = await prisma.record.findMany({
      where: filters,
      orderBy: {
        [sortBy]: order,
      },
      skip,
      take: pageSize,
    });

    res.status(200).json({
      success: true,
      data: records,
      pagination: {
        total: totalRecords,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(totalRecords / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update Record 
exports.updateRecord = async (req, res) => {
  try {
    const { id } = req.params;

    // Find record
    const record = await prisma.record.findUnique({
      where: { id: parseInt(id) },
    });

    // Ownership check
    if (!record || record.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    // Update (with date fix)
    const { date, ...rest } = req.body;

    const updated = await prisma.record.update({
      where: { id: parseInt(id) },
      data: {
        ...rest,
        ...(date && { date: new Date(date) }),
      },
    });

    res.status(200).json({
      success: true,
      message: "Record updated",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// Delete Record 
exports.deleteRecord = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find record
    const record = await prisma.record.findUnique({
      where: { id: parseInt(id) },
    });

    //  Ownership check
    if (!record || record.userId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    // Soft delete
    await prisma.record.update({
      where: { id: parseInt(id) },
      data: { isDeleted: true },
    });

    res.status(200).json({
      success: true,
      message: "Record deleted (soft delete)",
    });
  } catch (error) {
    next(error);
  }
};