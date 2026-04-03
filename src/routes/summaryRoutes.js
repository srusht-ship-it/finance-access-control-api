const express = require("express");
const router = express.Router();

const summaryController = require("../controllers/summaryController");
const authMiddleware = require("../middleware/authMiddleware");

// All logged-in users can view dashboard
router.get("/income", authMiddleware, summaryController.getTotalIncome);
router.get("/expense", authMiddleware, summaryController.getTotalExpense);
router.get("/balance", authMiddleware, summaryController.getNetBalance);
router.get("/category", authMiddleware, summaryController.getCategoryWise);
router.get("/trends", authMiddleware, summaryController.getMonthlyTrends);

module.exports = router;