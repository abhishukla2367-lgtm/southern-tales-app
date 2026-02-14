const Reservation = require('../models/Reservation');

/**
 * @desc    Create a new table reservation (Task 7)
 * @access  Private (Logged-in users only)
 */
exports.createReservation = async (req, res) => {
    try {
        const { date, time, guests, tableNumber, specialRequests, customerName, customerEmail } = req.body;

        // Task 7: Validation check (Ensures no empty reservations)
        if (!date || !time || !guests) {
            return res.status(400).json({ error: "Date, time, and guest count are required." });
        }

        // FIXED: Changed 'user' to 'userId' to match your Reservation Schema
        const newReservation = await Reservation.create({
            userId: req.user.id, // From your protect middleware
            customerName,        // Added for Admin visibility
            customerEmail,       // Added for Admin visibility
            date,
            time,
            guests,
            tableNumber: tableNumber || "TBD",
            specialRequests
        });

        res.status(201).json({ success: true, data: newReservation });
    } catch (err) {
        // This catch handles the 400/500 errors you were seeing
        res.status(400).json({ error: err.message });
    }
};

/**
 * @desc    Get reservations for the logged-in user's profile (Task 6)
 * @access  Private
 */
exports.getMyReservations = async (req, res) => {
    try {
        // FIXED: Changed query from 'user' to 'userId'
        const reservations = await Reservation.find({ userId: req.user.id }).sort({ date: -1 });
        
        // This 'data' key must match what your Profile.jsx is looking for
        res.status(200).json({ success: true, data: reservations });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * @desc    Get all reservations for Admin Dashboard (Task 7)
 * @access  Private/Admin
 */
exports.getAllAdminReservations = async (req, res) => {
    try {
        // FIXED: Populate using 'userId' field
        const reservations = await Reservation.find()
            .populate('userId', 'name email') 
            .sort({ date: -1 });
            
        res.status(200).json({ success: true, data: reservations });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
