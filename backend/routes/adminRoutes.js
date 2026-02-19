const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Reservation = require("../models/Reservation");
const User = require("../models/User");

// Import your custom middleware (Requirement #4 & #7)
const { protect,admin } = require("../middleware/protect");

/**
 * @route   GET /api/admin/reservations
 * @desc    Task 7: Display reservations on Admin side Reservation page
 * @access  Private (Admin only)
 */
router.get("/reservations", protect, admin, async (req, res) => {
  try {
    // Populate user details (name/email) from the User model for a professional UI
    const allReservations = await Reservation.find()
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 }); // Show newest bookings first
      
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
 * @desc    Professional Touch: Summary for Admin Dashboard
 */
router.get("/stats", protect, admin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalReservations = await Reservation.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    
    res.status(200).json({ totalOrders, totalReservations, totalUsers });
  } catch (err) {
    res.status(500).json({ message: "Stats fetch failed" });
  }
});

module.exports = router;
