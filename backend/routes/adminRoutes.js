const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Reservation = require("../models/Reservation");
const User = require("../models/User");

const { protect, admin } = require("../middleware/protect");

/**
 * @route   GET /api/admin/reservations
 * @desc    Task 7: Display reservations on Admin side Reservation page
 * @access  Private (Admin only)
 */
router.get("/reservations", protect, admin, async (req, res) => {
  try {
    const allReservations = await Reservation.find()
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json(allReservations);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reservations", error: err.message });
  }
});

/**
 * @route   GET /api/admin/orders
 * @desc    Task 8.3: Show order on Admin side Orders page
 * @access  Private (Admin only)
 */
router.get("/orders", protect, admin, async (req, res) => {
  try {
    const allOrders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(allOrders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
});

/**
 * @route   GET /api/admin/stats
 * @desc    Summary stats (total counts)
 * @access  Private (Admin only)
 */
router.get("/stats", protect, admin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalReservations = await Reservation.countDocuments();
    const totalUsers = await User.countDocuments({ role: "user" });

    res.status(200).json({ totalOrders, totalReservations, totalUsers });
  } catch (err) {
    res.status(500).json({ message: "Stats fetch failed" });
  }
});

/**
 * @route   GET /api/admin/dashboard-stats
 * @desc    Real-time stats for Dashboard Cards (today's data)
 * @access  Private (Admin only)
 */
router.get("/dashboard-stats", protect, admin, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayOrders, pendingOrders, totalReservations, revenueData] =
      await Promise.all([
        Order.countDocuments({ createdAt: { $gte: today } }),
        Order.countDocuments({ status: "Pending" }),
        Reservation.countDocuments(),
        Order.aggregate([
          { $match: { createdAt: { $gte: today } } },
          { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]),
      ]);

    res.status(200).json({
      todayOrders,
      pendingOrders,
      totalReservations,
      todayRevenue: revenueData[0]?.total || 0,
    });
  } catch (err) {
    console.error("❌ Dashboard Stats Error:", err.message);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
});

module.exports = router;