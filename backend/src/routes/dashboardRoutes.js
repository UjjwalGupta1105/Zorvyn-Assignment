const express = require("express");
const router = express.Router();

const {
  getSummary,
  getCategoryTotals,
  getRecentTransactions,
  getMonthlySummary,
} = require("../controllers/dashboardController");

const authenticate = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

router.use(authenticate);

// recent transactions — all roles can view this
router.get("/recent", allowRoles("viewer", "analyst", "admin"), getRecentTransactions);

// the detailed stats are for analyst/admin only
router.get("/summary", allowRoles("analyst", "admin"), getSummary);
router.get("/categories", allowRoles("analyst", "admin"), getCategoryTotals);
router.get("/monthly", allowRoles("analyst", "admin"), getMonthlySummary);

module.exports = router;
