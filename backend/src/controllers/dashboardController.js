const Record = require("../models/Record");

// GET /api/dashboard/summary
const getSummary = async (req, res) => {
  try {
    const aggResult = await Record.aggregate([
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    let totalIncome = 0;
    let totalExpenses = 0;

    // loop through and pick out income vs expense totals
    aggResult.forEach((item) => {
      if (item._id === "income") totalIncome = item.total;
      if (item._id === "expense") totalExpenses = item.total;
    });

    const netBalance = totalIncome - totalExpenses;

    res.json({ totalIncome, totalExpenses, netBalance });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong on server", error: err.message });
  }
};

// GET /api/dashboard/categories - analyst/admin only
const getCategoryTotals = async (req, res) => {
  try {
    const rawData = await Record.aggregate([
      {
        $group: {
          _id: { category: "$category", type: "$type" },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // flatten the _id object into a readable format
    const categoryList = rawData.map((item) => ({
      category: item._id.category,
      type: item._id.type,
      total: item.total,
      count: item.count,
    }));

    res.json(categoryList);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong on server", error: err.message });
  }
};

// GET /api/dashboard/recent
const getRecentTransactions = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const recentList = await Record.find()
      .populate("createdBy", "name email")
      .sort({ date: -1 })
      .limit(limit);

    res.json(recentList);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong on server", error: err.message });
  }
};

// GET /api/dashboard/monthly?year=2024
const getMonthlySummary = async (req, res) => {
  try {
    const targetYear = parseInt(req.query.year) || new Date().getFullYear();

    const monthlyData = await Record.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(`${targetYear}-01-01`),
            $lte: new Date(`${targetYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    // build a month-keyed object then convert to array
    const monthMap = {};
    monthlyData.forEach((item) => {
      const m = item._id.month;
      if (!monthMap[m]) {
        monthMap[m] = { month: m, income: 0, expense: 0, count: 0 };
      }
      monthMap[m][item._id.type] = item.total;
      monthMap[m].count += item.count;
    });

    const result = Object.values(monthMap);
    res.json({ year: targetYear, data: result });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong on server", error: err.message });
  }
};

module.exports = {
  getSummary,
  getCategoryTotals,
  getRecentTransactions,
  getMonthlySummary,
};
