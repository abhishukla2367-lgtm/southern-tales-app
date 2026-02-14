const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Order = require("../models/Order");
const Reservation = require("../models/Reservation");

// Task 4 & 6: Import the protection middleware
// Ensure this path is correct based on your folder structure
const { protect } = require("../middleware/protect");

/**
 * @route   GET /api/profile
 * @desc    Task 6: Fetch User Details, My Orders, and My Reservations
 * @access  Private
 */
router.get("/", protect, async (req, res) => {
  try {
    // Parallel fetching for high performance (Task 6.1 & 6.2)
    const [user, orders, reservations] = await Promise.all([
      // 1. Get user details (Task 5)
      User.findById(req.user.id).select("-password"),

      // 2. Get user orders (Task 8) - Ensure Order model also uses 'userId'
      Order.find({ userId: req.user.id }).sort({ createdAt: -1 }),

      // 3. Get user reservations (Task 7)
      // FIXED: Changed 'user' to 'userId' to match your ReservationSchema exactly
      Reservation.find({ userId: req.user.id }).sort({ date: 1 })
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the object structure your Frontend expects
    res.status(200).json({ 
      user, 
      orders, 
      reservations 
    });

  } catch (err) {
    console.error("Profile Router Error:", err.message);
    res.status(500).json({ 
      message: "Could not load profile data.", 
      error: err.message 
    });
  }
});

/**
 * @route   PUT /api/profile/update
 * @desc    Task 6.1: Update user details (Name, Phone, Address)
 * @access  Private
 */
router.put("/update", protect, async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { name, phone, address } },
      { new: true, runValidators: true } 
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

module.exports = router;
