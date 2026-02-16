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
    const { items, totalAmount, deliveryInfo, orderType } = req.body;

    // --- 1. VALIDATION (Requirement: Proper validations for all forms) ---
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cannot place an order with an empty cart." });
    }

    // Ensure delivery details exist to prevent Mongoose validation errors
    if (!deliveryInfo || !deliveryInfo.address || !deliveryInfo.phone) {
      return res.status(400).json({ 
        message: "Delivery details are missing. Please provide an address and phone number." 
      });
    }

    // --- 2. DATA MAPPING: Fixes "productId is required" Error ---
    // Maps frontend '_id' to the backend Schema's 'productId'
    const formattedItems = items.map((item) => ({
      productId: item._id, 
      name: item.name,
      quantity: item.quantity,
      price: Number(item.price)
    }));

    // --- 3. CREATE ORDER ---
    const newOrder = new Order({
      // Use fallback for ID property from protect middleware
      user: req.user._id || req.user.id, 
      items: formattedItems, 
      totalAmount,
      deliveryInfo, 
      orderType: orderType || "delivery", 
      status: "Pending",
      paymentStatus: "Unpaid"
    });

    const savedOrder = await newOrder.save();

    // --- 4. CLEAR CART (Task 8.2) ---
    // Remove the cart document for this user after successful order save
    await Cart.findOneAndDelete({ user: req.user._id || req.user.id }); 
    
    res.status(201).json({ 
        success: true,
        message: "Order placed successfully! Your cart has been cleared.", 
        order: savedOrder 
    });

  } catch (err) {
    console.error("Order Error:", err.message);
    res.status(500).json({ 
      message: "Order processing failed. Please try again.", 
      error: err.message 
    });
  }
});

/**
 * @route   GET /api/orders/my-orders
 * @desc    Task 6: Display "My Orders" in User Profile page
 * @access  Private
 */
router.get("/my-orders", protect, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    // Task 6: Fetch orders newest first for professional UI
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, orders }); 
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve your order history." });
  }
});

/**
 * @route   GET /api/orders/admin/all
 * @desc    Task 8.3: Show all orders on Admin side
 * @access  Private (Admin only)
 */
router.get("/admin/all", protect, admin, async (req, res) => {
  try {
    // Populate retrieves User's name and email for the Admin Dashboard
    const allOrders = await Order.find()
      .populate("user", "name email") 
      .sort({ createdAt: -1 });
      
    res.status(200).json(allOrders);
  } catch (err) {
    res.status(500).json({ message: "Admin: Failed to retrieve total order list." });
  }
});

module.exports = router;