const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Order = require("../models/Order");
const Reservation = require("../models/Reservation");

// Task 4 & 6: Import the protection middleware
const { protect } = require("../middleware/protect");

/**
 * @route   GET /api/profile
 * @desc    Task 6: Fetch User Details, My Orders, and My Reservations
 * @access  Private
 */
router.get("/", protect, async (req, res) => {
  try {
    // 1. Get the current user ID from the 'protect' middleware
    const currentUserId = req.user.id;

    // 2. Parallel fetching (Task 6.1 & 6.2)
    // Using Promise.all ensures we don't wait for one query to finish before starting the next
    const [user, orders, reservations] = await Promise.all([
      // info from User collection (Task 5)
      User.findById(currentUserId).select("-password"),

      // info from Order collection (Task 8)
      // ENSURE your Order schema uses 'userId' field name
      Order.find({ userId: currentUserId }).sort({ createdAt: -1 }),

      // info from Reservation collection (Task 7)
      // FIXED: Matches your ReservationSchema field name 'userId'
      Reservation.find({ userId: currentUserId }).sort({ date: 1 })
    ]);

    // 3. Validation: If user doesn't exist in DB anymore
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 4. Final Response (Matches Profile.jsx destructuring)
    // Structure: { user, orders, reservations }
    res.status(200).json({ 
      user, 
      orders: orders || [], 
      reservations: reservations || [] 
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
 * @desc    Professional Touch: Update user details (Task 6.1)
 * @access  Private
 */
router.put("/update", protect, async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { name, phone, address } },
      // new: true returns updated doc; runValidators ensures data is valid
      { new: true, runValidators: true } 
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Update Profile Error:", err.message);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

module.exports = router;
