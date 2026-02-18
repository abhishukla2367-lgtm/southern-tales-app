const Order = require('../models/Order');
const Cart = require('../models/Cart');
const mongoose = require('mongoose');

// @desc    Task 8: Place order, store in DB, and CLEAR CART
// @route   POST /api/orders
exports.placeOrder = async (req, res) => {
    try {
        const { items, totalAmount, deliveryInfo } = req.body;

        // 1. Validation: Ensure user is logged in and data is present
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized: Please log in." });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "Cannot place an empty order." });
        }

        // 2. Create Order (Task 8.1)
        // Explicitly use the ID from authMiddleware
        const newOrder = await Order.create({
            user: req.user.id, 
            items,
            totalAmount,
            deliveryInfo, 
            status: "Pending",
            paymentStatus: "Unpaid"
        });

        // 3. Clear User Cart (Task 8.2)
        // We find the cart for this user and delete it to "clear" it
        await Cart.findOneAndDelete({ user: req.user.id });

        res.status(201).json({
            success: true,
            message: "Order placed successfully!",
            order: newOrder
        });
    } catch (err) {
        console.error("Order Placement Error:", err.message);
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Task 6: Display My Orders in Profile page
// @route   GET /api/orders/my-orders
exports.getMyOrders = async (req, res) => {
    try {
        // Professional Fix: Convert string ID to ObjectId to ensure MongoDB finds a match
        const userId = new mongoose.Types.ObjectId(req.user.id);
        
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (err) {
        res.status(500).json({ success: false, error: "Failed to fetch your orders." });
    }
};

// @desc    Task 8.3: Show orders on Admin side Orders page
// @route   GET /api/orders/admin/all
exports.getAllOrders = async (req, res) => {
    try {
        // Requirement 8.3: Populate 'user' to show Name/Email on the Admin Dashboard
        const orders = await Order.find()
            .populate('user', 'name email phone') 
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });
    } catch (err) {
        res.status(500).json({ success: false, error: "Failed to fetch admin order list." });
    }
};
