const Order = require('../models/Order');
const Cart = require('../models/Cart');
const mongoose = require('mongoose');

/**
 * @desc    Task 8: Place order, store in DB, and CLEAR CART
 */
exports.placeOrder = async (req, res) => {
    try {
        const { items, totalAmount, deliveryInfo } = req.body;

        // 1. Safety Check for User (Prevent 500 crashes)
        if (!req.user || (!req.user.id && !req.user._id)) {
            return res.status(401).json({ success: false, message: "Authentication failed. No user found." });
        }

        // 2. Validate items array
        // ✅ FIX: Prevent orders with no items from being saved to DB
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ success: false, message: "Order must contain at least one item." });
        }

        // 3. Validate totalAmount
        // ✅ FIX: Prevent zero or missing totalAmount from creating broken orders
        if (!totalAmount || Number(totalAmount) <= 0) {
            return res.status(400).json({ success: false, message: "Invalid total amount." });
        }

        // 4. Validate deliveryInfo with trimming to catch blank strings
        // ✅ FIX: Use .trim() so empty strings don't pass validation
        if (
            !deliveryInfo ||
            !deliveryInfo.address?.trim() ||
            !deliveryInfo.phone?.trim()
        ) {
            return res.status(400).json({ success: false, message: "Delivery address and phone are required." });
        }

        // ✅ FIX: Handle both req.user.id and req.user._id consistently
        const userId = new mongoose.Types.ObjectId(req.user.id || req.user._id);

        // 5. Create Order
        const newOrder = await Order.create({
            userId,
            items,
            totalAmount,
            deliveryInfo,
            status: "Pending",
            paymentStatus: "Unpaid"
        });

        // 6. Clear Cart (Make sure your Cart model uses 'userId' field too!)
        await Cart.findOneAndDelete({ userId });

        res.status(201).json({
            success: true,
            message: "Order placed successfully!",
            order: newOrder
        });

    } catch (err) {
        console.error("❌ Order Placement Error:", err); // Log the WHOLE error, not just message
        res.status(500).json({ success: false, error: err.message });
    }
};

/**
 * @desc    Task 6: Display My Orders in Profile page
 */
exports.getMyOrders = async (req, res) => {
    try {
        // ✅ FIX: Match same pattern as placeOrder — handle both id and _id
        if (!req.user || (!req.user.id && !req.user._id)) {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        const userId = new mongoose.Types.ObjectId(req.user.id || req.user._id);

        const orders = await Order.find({ userId }).sort({ createdAt: -1 });

        console.log(`📡 Fetching profile orders for ${userId}: Found ${orders.length}`);

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (err) {
        console.error("❌ getMyOrders Error:", err.message);
        res.status(500).json({ success: false, error: "Failed to fetch your orders." });
    }
};

/**
 * @desc    Task 8.3: Show orders on Admin side Orders page
 * @access  Private (Admin Only) — ensure adminOnly middleware is on this route
 */
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (err) {
        console.error("❌ Admin Fetch Error:", err.message);
        res.status(500).json({ success: false, error: "Failed to fetch admin order list." });
    }
};