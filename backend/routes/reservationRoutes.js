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
      phone,
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

// ==========================================
// TASK 2: WALK-IN RESERVATIONS (ADMIN SIDE)
// ==========================================

// GET all walk-in reservations
router.get("/walkin", protect, admin, async (req, res) => {
  try {
    const walkIns = await Reservation.find({ type: "walk-in" })
      .sort({ createdAt: -1 });
    res.status(200).json(walkIns);
  } catch (err) {
    console.error("Walk-in Fetch Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch walk-in reservations" });
  }
});

// POST create a walk-in reservation (Admin only)
// ✅ Works correctly now that customerEmail is required:false in Reservation.js
router.post("/walkin", protect, admin, async (req, res) => {
  try {
    const { customerName, phone, guests, tableNumber, date, time, status, specialRequests } = req.body;

    if (!customerName || !guests || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "customerName, guests, date and time are required"
      });
    }

    const reservation = new Reservation({
      customerName,
      customerEmail:   "",
      phone:           phone           || "",
      guests:          Number(guests),
      tableNumber:     tableNumber     || "TBD",
      date:            new Date(date),
      time,
      status:          status          || "Waiting",
      specialRequests: specialRequests || "",
      type:            "walk-in",
      // userId intentionally omitted
    });

    const saved = await reservation.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Create Walk-in Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH update reservation status (Admin only)
router.patch("/:id/status", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Reservation not found" });
    res.json(updated);
  } catch (err) {
    console.error("Status Update Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
});

// DELETE a reservation (Admin only)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const deleted = await Reservation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Reservation not found" });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to delete reservation" });
  }
});

module.exports = router;