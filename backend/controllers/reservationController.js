const Reservation = require('../models/Reservation');

/**
 * @desc    Create a new table reservation (Customer side)
 * @route   POST /api/reservations
 * @access  Private (Logged-in users only)
 */
exports.createReservation = async (req, res) => {
    try {
        const { date, time, guests, tableNumber, specialRequests, customerName, customerEmail } = req.body;

        if (!date || !time || !guests) {
            return res.status(400).json({ error: "Date, time, and guest count are required." });
        }

        const newReservation = await Reservation.create({
            userId:        req.user.id,
            customerName,
            customerEmail,
            date,
            time,
            guests,
            tableNumber:      tableNumber || "TBD",
            specialRequests,
            type:             "online",
        });

        res.status(201).json({
            success: true,
            message: "Table reserved successfully!",
            data:    newReservation,
        });

    } catch (err) {
        console.error("Create Reservation Error:", err.message);
        res.status(500).json({ error: "Server could not process reservation", details: err.message });
    }
};

/**
 * @desc    Get reservations for the logged-in user's profile
 * @route   GET /api/reservations/my
 * @access  Private
 */
exports.getMyReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({ userId: req.user.id }).sort({ date: -1 });

        res.status(200).json({
            success:      true,
            count:        reservations.length,
            reservations,
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch your reservations" });
    }
};

/**
 * @desc    Get all reservations for the Admin dashboard (online bookings + walk-ins)
 * @route   GET /api/reservations/admin/all
 * @access  Private/Admin
 */
exports.getAllAdminReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find()
            .populate('userId', 'name email')
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            data:    reservations,
        });
    } catch (err) {
        res.status(500).json({ error: "Admin fetch failed" });
    }
};

/**
 * @desc    Get all walk-in reservations for the Walk-in page
 * @route   GET /api/reservations/walkin
 * @access  Private/Admin
 */
exports.getWalkIns = async (req, res) => {
    try {
        const walkIns = await Reservation.find({ type: "walk-in" }).sort({ createdAt: -1 });

        res.status(200).json(walkIns);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch walk-ins" });
    }
};

/**
 * @desc    Create a walk-in reservation
 *          Task c: checks if selected table is already occupied before saving
 * @route   POST /api/reservations/walkin
 * @access  Private/Admin
 */
exports.createWalkIn = async (req, res) => {
    try {
        const {
            customerName, phone, guests, tableNumber,
            date, time, status, specialRequests,
        } = req.body;

        if (!customerName || !guests || !date || !time) {
            return res.status(400).json({ error: "Name, guests, date and time are required." });
        }

        // ── Task c: Block booking if selected table is already occupied ──
        if (tableNumber && tableNumber !== "TBD") {
            const occupied = await Reservation.findOne({
                tableNumber,
                status: { $in: ["Waiting", "Seated"] },
            });

            if (occupied) {
                return res.status(400).json({
                    error: "This table is occupied, please choose another table number.",
                });
            }
        }

        const reservation = await Reservation.create({
            customerName,
            customerEmail:   "",
            phone:           phone || "",
            guests,
            tableNumber:     tableNumber || "TBD",
            date,
            time,
            status:          status || "Waiting",
            specialRequests: specialRequests || "",
            type:            "walk-in",
        });

        res.status(201).json({ success: true, data: reservation });

    } catch (err) {
        console.error("Create Walk-in Error:", err.message);
        res.status(500).json({ error: "Failed to create walk-in", details: err.message });
    }
};

/**
 * @desc    Update reservation status
 *          Task a & b: Completed reservations are fully locked — status cannot be changed
 * @route   PATCH /api/reservations/:id/status
 * @access  Private/Admin
 */
exports.updateStatus = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ error: "Reservation not found." });
        }

        // ── Task a & b: Block update if already Completed ──
        if (reservation.status === "Completed") {
            return res.status(403).json({
                error: "Completed reservations cannot be modified.",
            });
        }

        reservation.status = req.body.status;
        await reservation.save();

        res.status(200).json({ success: true, data: reservation });

    } catch (err) {
        console.error("Update Status Error:", err.message);
        res.status(500).json({ error: "Failed to update status", details: err.message });
    }
};

/**
 * @desc    Delete a reservation
 *          Task b: Completed records cannot be deleted
 * @route   DELETE /api/reservations/:id
 * @access  Private/Admin
 */
exports.deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ error: "Reservation not found." });
        }

        // ── Task b: Block delete if record is Completed ──
        if (reservation.status === "Completed") {
            return res.status(403).json({
                error: "Completed reservations cannot be deleted.",
            });
        }

        await reservation.deleteOne();

        res.status(200).json({ success: true, message: "Reservation deleted successfully." });

    } catch (err) {
        console.error("Delete Reservation Error:", err.message);
        res.status(500).json({ error: "Failed to delete reservation", details: err.message });
    }
};