const prisma = require("../config/db");

// 🔹 Create Record (ADMIN)
exports.createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    if (!amount || !type || !category || !date) {
      return res.status(400).json({ message: "Required fields missing" });
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

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Get Records (ANALYST + ADMIN)
exports.getRecords = async (req, res) => {
  try {
    const { type, category } = req.query;

    const records = await prisma.record.findMany({
      where: {
        ...(type && { type }),
        ...(category && { category }),
      },
      orderBy: { date: "desc" },
    });

    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Update Record (ADMIN)
exports.updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updated = await prisma.record.update({
      where: { id: parseInt(id) },
      data,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Delete Record (ADMIN)
exports.deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.record.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Record deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};