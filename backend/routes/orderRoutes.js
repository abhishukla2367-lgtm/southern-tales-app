const express = require("express");
const router = express.Router();
const Order = require("../models/Order"); 
const Cart = require("../models/Cart"); 

// Task 4 & 5: Middleware to ensure only logged-in users and admins can access routes
const { protect, admin } = require("../middleware/protect");

/**
 * @route   POST /api/orders
 * @desc    Task 8: Place order (8.1), and CLEAR CART (8.2)
 * @access  Private (Login Required)
 */
router.post("/", protect, async (req, res) => {
  try {
    const { items, totalAmount, deliveryInfo } = req.body;

    // --- Validation (Internship Requirement: Proper validations for all forms) ---
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cannot place an order with an empty cart." });
    }

    if (!deliveryInfo || !deliveryInfo.address || !deliveryInfo.phone) {
      return res.status(400).json({ 
        message: "Delivery details are missing. Please provide address and phone number." 
      });
    }

    // 1. Create and Store order in database (Task 8.1)
    const newOrder = new Order({
      user: req.user.id, // Linked to MongoDB Atlas User ID from protect middleware
      items,
      totalAmount,
      deliveryInfo, 
      status: "Pending",
      paymentStatus: "Unpaid"
    });

    const savedOrder = await newOrder.save();

    // 2. Remove items from cart (Task 8.2)
    // We only clear the cart AFTER the order is successfully saved to Atlas
    await Cart.findOneAndDelete({ user: req.user.id }); 
    
    res.status(201).json({ 
        success: true,
        message: "Order placed successfully! Your cart has been cleared.", 
        order: savedOrder 
    });
  } catch (err) {
    console.error("Order Error:", err.message);
    res.status(500).json({ message: "Order processing failed. Please try again.", error: err.message });
  }
});

/**
 * @route   GET /api/orders/my-orders
 * @desc    Task 6: Display "My Orders" in User Profile page
 * @access  Private
 */
router.get("/my-orders", protect, async (req, res) => {
  try {
    // Task 6: Fetch orders only for the logged-in user
    // Sorted by createdAt: -1 (Newest first) for a professional UI experience
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, orders: orders }); 
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve your order history." });
  }
});

/**
 * @route   GET /api/orders/admin/all
 * @desc    Task 8.3: Show all orders on Admin side Orders page
 * @access  Private (Admin only)
 */
router.get("/admin/all", protect, admin, async (req, res) => {
  try {
    // Task 8.3: Populate retrieves User's name and email for the Admin Dashboard
    // This connects the Order collection back to the User collection in Atlas
    const allOrders = await Order.find()
      .populate("user", "name email") 
      .sort({ createdAt: -1 });
      
    res.status(200).json(allOrders);
  } catch (err) {
    res.status(500).json({ message: "Admin: Failed to retrieve total order list." });
  }
});

module.exports = router;
