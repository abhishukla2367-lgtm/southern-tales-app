const express = require("express");
const router = express.Router();
const Order = require("../models/Order"); 
const Cart = require("../models/Cart"); 

// Import middlewares - Standardizing to use 'protect'
const { protect, admin } = require("../middleware/protect");

/**
 * @route   POST /api/orders
 * @desc    Task 8: Place order (8.1), and CLEAR CART (8.2)
 * @access  Private (Login Required)
 */
router.post("/", protect, async (req, res) => {
  try {
    const { items, totalAmount, deliveryInfo, orderType } = req.body;

    // --- 1. VALIDATION ---
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cannot place an order with an empty cart." });
    }

    if (!deliveryInfo || !deliveryInfo.address || !deliveryInfo.phone) {
      return res.status(400).json({ 
        message: "Delivery details are missing (Address and Phone required)." 
      });
    }

    // --- 2. DATA MAPPING: UI '_id' to Schema 'productId' ---
    const formattedItems = items.map((item) => ({
      productId: item._id || item.productId, 
      name: item.name,
      quantity: item.quantity,
      price: Number(item.price)
    }));

    // --- 3. CREATE ORDER ---
    const newOrder = new Order({
      user: req.user._id, 
      items: formattedItems, 
      totalAmount,
      deliveryInfo, 
      status: "Pending",
      paymentStatus: "Unpaid"
    });

    const savedOrder = await newOrder.save();

    // --- 4. CLEAR CART (Task 8.2) ---
    await Cart.findOneAndDelete({ user: req.user._id }); 
    
    res.status(201).json({ 
        success: true,
        message: "Order placed successfully!", 
        order: savedOrder 
    });

  } catch (err) {
    console.error("Order Error:", err.message);
    res.status(500).json({ 
      message: "Order processing failed.", 
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
    // Task 6: Fetch orders specifically for the logged-in user
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    res.status(200).json({ 
      success: true, 
      count: orders.length,
      orders 
    }); 
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
    const allOrders = await Order.find()
      .populate("user", "name email") 
      .sort({ createdAt: -1 });
      
    res.status(200).json(allOrders);
  } catch (err) {
    res.status(500).json({ message: "Admin: Failed to retrieve total order list." });
  }
});

module.exports = router;
