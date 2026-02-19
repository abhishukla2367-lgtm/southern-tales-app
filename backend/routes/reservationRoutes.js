const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const { protect, admin } = require("../middleware/protect");

// ==========================================
// TASK 7: TABLE RESERVATION (USER SIDE)
// ==========================================
router.post("/", protect, async (req, res) => {
  try {
    const { name, email, phone, date, time, guests, specialRequests } = req.body;

    const newReservation = new Reservation({
      userId: req.user.id,
      customerName: name,
      customerEmail: email,
      phone,          // ✅ Added
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
router.get("/my-reservations", protect, async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user.id })
      .sort({ date: -1 }); 

    res.status(200).json({
      success: true,
      count: reservations.length,
      reservations
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
router.get("/admin/all", protect, admin, async (req, res) => {
  try {
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