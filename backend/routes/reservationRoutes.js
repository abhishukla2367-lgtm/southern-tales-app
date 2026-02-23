const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const { protect, admin } = require("../middleware/protect");

// ==========================================
// USER SIDE: CREATE RESERVATION
// ==========================================

/**
 * @route   POST /api/reservations
 * @desc    Customer books a table online
 * @access  Private
 */
router.post("/", protect, async (req, res) => {
  try {
    // ✅ FIXED: now matches updated Reservation.jsx which sends customerName/customerEmail
    const { customerName, customerEmail, phone, date, time, guests, specialRequests } = req.body;

    if (!customerName || !date || !time || !guests) {
      return res.status(400).json({ success: false, message: "Name, date, time and guests are required." });
    }

    const newReservation = new Reservation({
      userId:        req.user.id,
      customerName,
      customerEmail,
      phone,
      date,
      time,
      guests,
      specialRequests,
      type:          "online",
    });

    await newReservation.save();
    res.status(201).json({ success: true, message: "Reservation confirmed!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// USER SIDE: MY RESERVATIONS (Profile Page)
// ==========================================

/**
 * @route   GET /api/reservations/my-reservations
 * @desc    Get logged-in user's own reservations
 * @access  Private
 */
router.get("/my-reservations", protect, async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user.id })
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count:   reservations.length,
      reservations,
    });
  } catch (err) {
    console.error("Profile Fetch Error:", err.message);
    res.status(500).json({ success: false, message: "Error retrieving your reservations." });
  }
});

// ==========================================
// ADMIN SIDE: ALL RESERVATIONS
// ==========================================

/**
 * @route   GET /api/reservations/admin/all
 * @desc    Admin sees all reservations (online + walk-in)
 * @access  Private/Admin
 */
router.get("/admin/all", protect, admin, async (req, res) => {
  try {
    const allReservations = await Reservation.find()
      .populate("userId", "name email")
      .sort({ date: -1 });  // ✅ FIXED: was sort ascending, now newest first

    res.status(200).json({ success: true, data: allReservations });
  } catch (err) {
    console.error("Admin Fetch Error:", err.message);
    res.status(500).json({ success: false, message: "Admin Access Error: Could not fetch all reservations." });
  }
});

// ==========================================
// ADMIN SIDE: WALK-IN RESERVATIONS
// ==========================================

/**
 * @route   GET /api/reservations/walkin
 * @desc    Get all walk-in reservations for the Walk-in page
 * @access  Private/Admin
 */
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

/**
 * @route   POST /api/reservations/walkin
 * @desc    Admin creates a walk-in reservation
 *          Task c: checks if selected table is already occupied before saving
 * @access  Private/Admin
 */
router.post("/walkin", protect, admin, async (req, res) => {
  try {
    const { customerName, phone, guests, tableNumber, date, time, status, specialRequests } = req.body;

    if (!customerName || !guests || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "customerName, guests, date and time are required",
      });
    }

    // ── Task c: Block booking if table is already occupied ──
    if (tableNumber && tableNumber !== "TBD") {
      const occupied = await Reservation.findOne({
        tableNumber,
        status: { $in: ["Waiting", "Seated"] },
      });

      if (occupied) {
        return res.status(400).json({
          success: false,
          message: "This table is occupied, please choose another table number.",
        });
      }
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
      // userId intentionally omitted — walk-ins have no account
    });

    const saved = await reservation.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Create Walk-in Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// ADMIN SIDE: UPDATE STATUS
// ==========================================

/**
 * @route   PATCH /api/reservations/:id/status
 * @desc    Update reservation status
 *          Task a & b: Completed records are fully locked — cannot be changed
 * @access  Private/Admin
 */
router.patch("/:id/status", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;

    const reservation = await Reservation.findById(req.params.id);
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });

    // ── Task a & b: Block update if already Completed ──
    if (reservation.status === "Completed") {
      return res.status(403).json({
        success: false,
        message: "Completed reservations cannot be modified.",
      });
    }

    reservation.status = status;
    await reservation.save();

    res.status(200).json({ success: true, data: reservation });
  } catch (err) {
    console.error("Status Update Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
});

// ==========================================
// ADMIN SIDE: DELETE RESERVATION
// ==========================================

/**
 * @route   DELETE /api/reservations/:id
 * @desc    Delete a reservation
 *          Task b: Completed records cannot be deleted
 * @access  Private/Admin
 */
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });

    // ── Task b: Block delete if record is Completed ──
    if (reservation.status === "Completed") {
      return res.status(403).json({
        success: false,
        message: "Completed reservations cannot be deleted.",
      });
    }

    await reservation.deleteOne();
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to delete reservation" });
  }
});

module.exports = router;