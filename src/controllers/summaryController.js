const prisma = require("../config/db");

//  Total Income
exports.getTotalIncome = async (req, res) => {
  try {
    const result = await prisma.record.aggregate({
      _sum: { amount: true },
      where: { type: "INCOME" , isDeleted:false},
    });

    res.status(200).json({
  success: true,
  data: { totalIncome: result._sum.amount || 0 },
});
  } catch (error) {
    res.status(500).json({ success:false,
        error: error.message });
  }
};

//  Total Expense
exports.getTotalExpense = async (req, res) => {
  try {
    const result = await prisma.record.aggregate({
      _sum: { amount: true },
      where: { type: "EXPENSE" },
    });

    res.status(200).json({
  success: true,
  data: { totalExpense: result._sum.amount || 0 },
});
  } catch (error) {
    res.status(500).json({ success:false,
        error: error.message });
  }
};

//  Net Balance
exports.getNetBalance = async (req, res) => {
  try {
    const income = await prisma.record.aggregate({
      _sum: { amount: true },
      where: { type: "INCOME" },
    });

    const expense = await prisma.record.aggregate({
      _sum: { amount: true },
      where: { type: "EXPENSE" },
    });

    const net = (income._sum.amount || 0) - (expense._sum.amount || 0);

   res.status(200).json({
  success: true,
  data: { netBalance: net },
});
  } catch (error) {
    res.status(500).json({ success:false,
        error: error.message });
  }
};

//Category-wise totals
exports.getCategoryWise = async (req, res) => {
  try {
    const data = await prisma.record.groupBy({
      by: ["category"],
      _sum: { amount: true },
    });

   res.status(200).json({
  success: true,
  data,
});
  } catch (error) {
    res.status(500).json({ success:false,
        error: error.message });
  }
};

// Monthly Trends
exports.getMonthlyTrends = async (req, res) => {
  try {
    const data = await prisma.record.findMany({
      select: {
        amount: true,
        date: true,
        type: true,
      },
    });

    const trends = {};

    data.forEach((item) => {
      const month = new Date(item.date).toISOString().slice(0, 7);

      if (!trends[month]) {
        trends[month] = { income: 0, expense: 0 };
      }

      if (item.type === "INCOME") {
        trends[month].income += item.amount;
      } else {
        trends[month].expense += item.amount;
      }
    });

    res.status(200).json({
  success: true,
  data: trends,
});
  } catch (error) {
    res.status(500).json({ success:false,
        error: error.message });
  }
};

// Recent Activity
exports.getRecentActivity = async (req, res) => {
  try {
    const records = await prisma.record.findMany({
      where:{
        isDeleted:false,
        userId:req.user.userId
      },
      take: 5,
      orderBy: { date: "desc" },
      select: {
        id: true,
        amount: true,
        type: true,
        category: true,
        date: true,
        notes: true,
      },
    });

    res.status(200).json({
      success: true,
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.restoreRecord = async (req, res, next) => {
  try {
    const { id } = req.params;

    const record = await prisma.record.update({
      where: { id: parseInt(id) },
      data: { isDeleted: false },
    });

    res.status(200).json({
      success: true,
      message: "Record restored",
      data: record,
    });
  } catch (error) {
    next(error);
  }
};