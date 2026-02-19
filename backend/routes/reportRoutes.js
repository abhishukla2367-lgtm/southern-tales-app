const express = require("express");
const router = express.Router();
const { getReport } = require("../controllers/reportController");
const { protect, admin } = require("../middleware/protect");

/**
 * @route   GET /api/reports/weekly
 * @route   GET /api/reports/monthly
 * @route   GET /api/reports/annual
 * @desc    Task 3: Generate reports for admin dashboard
 * @access  Private (Admin only)
 */
router.get("/:type", protect, admin, getReport);

module.exports = router;