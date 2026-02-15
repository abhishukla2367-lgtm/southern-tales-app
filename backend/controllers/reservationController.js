const Reservation = require('../models/Reservation');

/**
 * @desc    Task 7: Create a new table reservation
 * @access  Private (Logged-in users only)
 */
exports.createReservation = async (req, res) => {
    try {
        const { date, time, guests, tableNumber, specialRequests, customerName, customerEmail } = req.body;

        // Validation check (Task 7 requirement)
        if (!date || !time || !guests) {
            return res.status(400).json({ error: "Date, time, and guest count are required." });
        }

        // Create reservation linked to the logged-in user via userId
        const newReservation = await Reservation.create({
            userId: req.user.id, // From 'protect' middleware
            customerName,        // For Admin visibility
            customerEmail,       // For Admin visibility
            date,
            time,
            guests,
            tableNumber: tableNumber || "TBD",
            specialRequests
        });

        // SUCCESS: Send back the data for immediate UI updates
        res.status(201).json({ 
            success: true, 
            message: "Table reserved successfully!", 
            data: newReservation 
        });

    } catch (err) {
        // Detailed error logging to help you see crashes in the terminal
        console.error("Create Reservation Error:", err.message);
        res.status(500).json({ error: "Server could not process reservation", details: err.message });
    }
};

/**
 * @desc    Task 6: Get reservations for the logged-in user's profile
 * @access  Private
 */
exports.getMyReservations = async (req, res) => {
    try {
        // Querying by userId as defined in your Schema
        const reservations = await Reservation.find({ userId: req.user.id }).sort({ date: -1 });
        
        // This 'data' key MUST match your Profile.jsx destructuring: { reservations } = data
        res.status(200).json({ 
            success: true, 
            count: reservations.length, 
            reservations // Directly naming the array makes it easier for the frontend
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch your reservations" });
    }
};

/**
 * @desc    Task 7 Admin Side: Get all reservations for the Admin dashboard
 * @access  Private/Admin
 */
exports.getAllAdminReservations = async (req, res) => {
    try {
        // Populate links the 'userId' to the actual User collection to show Name/Email
        const reservations = await Reservation.find()
            .populate('userId', 'name email') 
            .sort({ date: -1 });
            
        res.status(200).json({ 
            success: true, 
            data: reservations 
        });
    } catch (err) {
        res.status(500).json({ error: "Admin fetch failed" });
    }
};
