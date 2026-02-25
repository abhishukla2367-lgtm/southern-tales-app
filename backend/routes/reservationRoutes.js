const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/protect");

// ✅ FIX: Import controller functions instead of duplicating logic inline
const {
  createReservation,
  getMyReservations,
  getAllAdminReservations,
  getWalkIns,
  createWalkIn,
  updateStatus,
  deleteReservation,
} = require("../controllers/reservationController");

// ==========================================
// USER SIDE: CREATE RESERVATION
// ==========================================

/**
 * @route   POST /api/reservations
 * @desc    Customer books a table online
 * @access  Private
 */
router.post("/", protect, createReservation);

// ==========================================
// USER SIDE: MY RESERVATIONS (Profile Page)
// ==========================================

/**
 * @route   GET /api/reservations/my-reservations
 * @desc    Get logged-in user's own reservations
 * @access  Private
 * ⚠️ Must be defined BEFORE /:id to avoid Express treating "my-reservations" as an id
 */
router.get("/my-reservations", protect, getMyReservations);

// ==========================================
// ADMIN SIDE: ALL RESERVATIONS
// ==========================================

/**
 * @route   GET /api/reservations/admin/all
 * @desc    Admin sees all reservations (online + walk-in)
 * @access  Private/Admin
 * ⚠️ Must be defined BEFORE /:id to avoid Express treating "admin" as an id
 */
router.get("/admin/all", protect, admin, getAllAdminReservations);

// ==========================================
// ADMIN SIDE: WALK-IN RESERVATIONS
// ==========================================

/**
 * @route   GET /api/reservations/walkin
 * @desc    Get all walk-in reservations for the Walk-in page
 * @access  Private/Admin
 * ⚠️ Must be defined BEFORE /:id to avoid Express treating "walkin" as an id
 */
router.get("/walkin", protect, admin, getWalkIns);

/**
 * @route   POST /api/reservations/walkin
 * @desc    Admin creates a walk-in reservation
 *          Task c: checks if selected table is already occupied before saving
 * @access  Private/Admin
 */
router.post("/walkin", protect, admin, createWalkIn);

// ==========================================
// ADMIN SIDE: UPDATE STATUS
// ==========================================

/**
 * @route   PATCH /api/reservations/:id/status
 * @desc    Update reservation status
 *          Task a & b: Completed records are fully locked — cannot be changed
 * @access  Private/Admin
 */
router.patch("/:id/status", protect, admin, updateStatus);

// ==========================================
// ADMIN SIDE: DELETE RESERVATION
// ==========================================

/**
 * @route   DELETE /api/reservations/:id
 * @desc    Delete a reservation
 *          Task b: Completed records cannot be deleted
 * @access  Private/Admin
 */
router.delete("/:id", protect, admin, deleteReservation);

module.exports = router;