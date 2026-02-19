const Reservation = require("../models/Reservation");
const Order = require("../models/Order");

/**
 * @desc    Task 7: Get all reservations for Admin side
 * @access  Private (Admin Only)
 */
exports.getAdminReservations = async (req, res) => {
    try {
        // Populates user name and email so admin knows the customer
        const reservations = await Reservation.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: reservations });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch reservations" });
    }
};

/**
 * @desc    Task 8: Get all customer orders for Admin side
 * @access  Private (Admin Only)
 */
exports.getAdminOrders = async (req, res) => {
    try {
        // FIX: populate "userId" to match Order.js schema (not "user")
        const orders = await Order.find()
            .populate("userId", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: orders });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch orders" });
    }
};

/**
 * @desc    Update Order/Reservation Status (Professional UI Requirement)
 * @access  Private (Admin Only)
 */
exports.updateStatus = async (req, res) => {
    try {
        const { id, type, status } = req.body; // type is 'order' or 'reservation'
        const Model = type === 'order' ? Order : Reservation;
        
        const updatedDoc = await Model.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json({ success: true, data: updatedDoc });
    } catch (err) {
        res.status(500).json({ success: false, message: "Update failed" });
    }
};