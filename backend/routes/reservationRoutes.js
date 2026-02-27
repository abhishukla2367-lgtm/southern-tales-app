const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/protect");

const {
  createReservation,
  getMyReservations,
  getOccupiedTables,
  getAllAdminReservations,
  getWalkIns,
  createWalkIn,
  updateStatus,
  updateTable,
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
// USER SIDE: OCCUPIED TABLES (Table Picker)
// ==========================================

/**
 * @route   GET /api/reservations/occupied-tables
 * @desc    Returns list of currently occupied table numbers for the customer table picker
 * @access  Private
 * ⚠️ Must be defined BEFORE /:id to avoid Express treating "occupied-tables" as an id
 */
router.get("/occupied-tables", protect, getOccupiedTables);

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
 * @access  Private/Admin
 */
router.post("/walkin", protect, admin, createWalkIn);

// ==========================================
// ADMIN SIDE: UPDATE STATUS
// ==========================================

/**
 * @route   PATCH /api/reservations/:id/status
 * @desc    Update reservation status
 *          Completed records are fully locked — cannot be changed
 * @access  Private/Admin
 */
router.patch("/:id/status", protect, admin, updateStatus);

// ==========================================
// ADMIN SIDE: UPDATE TABLE
// ==========================================

/**
 * @route   PATCH /api/reservations/:id/table
 * @desc    Admin reassigns a table number from the dashboard
 *          Blocks if target table is already occupied by another reservation
 *          Completed records are locked — cannot be changed
 * @access  Private/Admin
 */
router.patch("/:id/table", protect, admin, updateTable);

// ==========================================
// ADMIN SIDE: DELETE RESERVATION
// ==========================================

/**
 * @route   DELETE /api/reservations/:id
 * @desc    Delete a reservation
 *          Completed records cannot be deleted
 * @access  Private/Admin
 */
router.delete("/:id", protect, admin, deleteReservation);

module.exports = router;