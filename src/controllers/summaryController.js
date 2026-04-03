const prisma = require("../config/db");

// 🔹 Total Income
exports.getTotalIncome = async (req, res) => {
  try {
    const result = await prisma.record.aggregate({
      _sum: { amount: true },
      where: { type: "INCOME" },
    });

    res.json({ totalIncome: result._sum.amount || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Total Expense
exports.getTotalExpense = async (req, res) => {
  try {
    const result = await prisma.record.aggregate({
      _sum: { amount: true },
      where: { type: "EXPENSE" },
    });

    res.json({ totalExpense: result._sum.amount || 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Net Balance
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

    res.json({ netBalance: net });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Category-wise totals
exports.getCategoryWise = async (req, res) => {
  try {
    const data = await prisma.record.groupBy({
      by: ["category"],
      _sum: { amount: true },
    });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Monthly Trends
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

    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};