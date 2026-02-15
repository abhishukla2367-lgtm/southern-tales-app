const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const { protect, admin } = require("../middleware/protect");

// ==========================================
// TASK 7: TABLE RESERVATION (USER SIDE)
// ==========================================
/**
 * @route   POST /api/reservations
 * @desc    Task 4 & 7: Reserve a table (Requires Login)
 * @access  Private
 */
// Inside reservationRoutes.js
router.post("/", protect, async (req, res) => {
  try {
    const { name, email, phone, date, time, guests, specialRequests } = req.body;

    const newReservation = new Reservation({
      userId: req.user.id,
      customerName: name,      // Map 'name' from frontend to 'customerName' in Schema
      customerEmail: email,    // Map 'email' from frontend to 'customerEmail' in Schema
      phone,                   // Ensure this is in your Schema too!
      date,
      time,
      guests,
      specialRequests
    });

    await newReservation.save();
    res.status(201).json({ success: true, message: "Reservation confirmed!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// TASK 6: USER PROFILE (MY RESERVATIONS)
// ==========================================
/**
 * @route   GET /api/reservations/my-reservations
 * @desc    Task 6: Display personal reservations on Profile page
 * @access  Private
 */
router.get("/my-reservations", protect, async (req, res) => {
  try {
    // Fixed: Must query by 'userId' to match your Schema
    const reservations = await Reservation.find({ userId: req.user.id })
      .sort({ date: -1 }); 

    res.status(200).json({
      success: true,
      count: reservations.length,
      reservations: reservations // Key matches Profile.jsx: const { reservations } = data
    });
  } catch (err) {
    console.error("Profile Fetch Error:", err.message);
    res.status(500).json({ 
      success: false, 
      message: "Error retrieving your reservations." 
    });
  }
});

// ==========================================
// TASK 7: ADMIN DASHBOARD (ALL RESERVATIONS)
// ==========================================
/**
 * @route   GET /api/reservations/admin/all
 * @desc    Task 7: Display ALL reservations on Admin side
 * @access  Private (Admin Only)
 */
router.get("/admin/all", protect, admin, async (req, res) => {
  try {
    // Fixed: Populate 'userId' (not 'user') to match Schema
    const allReservations = await Reservation.find()
      .populate("userId", "name email") 
      .sort({ date: 1 });
      
    res.status(200).json({
      success: true,
      data: allReservations
    });
  } catch (err) {
    console.error("Admin Fetch Error:", err.message);
    res.status(500).json({ 
      success: false, 
      message: "Admin Access Error: Could not fetch all reservations." 
    });
  }
});

module.exports = router;
