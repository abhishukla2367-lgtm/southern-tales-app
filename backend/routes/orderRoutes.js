const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/Order"); 
const Cart = require("../models/Cart"); 

// Import middlewares
const { protect, admin } = require("../middleware/protect");

/**
 * @route   POST /api/orders
 * @desc    Task 8: Place order (8.1), and CLEAR CART (8.2)
 * @access  Private (Login Required)
 */
router.post("/", protect, async (req, res) => {
  try {
    const { items, totalAmount, deliveryInfo } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cannot place an order with an empty cart." });
    }

    if (!deliveryInfo || !deliveryInfo.address || !deliveryInfo.phone) {
      return res.status(400).json({ 
        message: "Delivery details are missing (Address and Phone required)." 
      });
    }

    const formattedItems = items.map((item) => ({
      productId: item._id || item.productId, 
      name: item.name,
      quantity: item.quantity,
      price: Number(item.price)
    }));

    const newOrder = new Order({
      userId: req.user.id, 
      items: formattedItems, 
      totalAmount: Number(totalAmount),
      deliveryInfo, 
      status: "Pending",
      paymentStatus: "Unpaid"
    });

    const savedOrder = await newOrder.save();

    await Cart.findOneAndDelete({ userId: req.user.id }); 
    
    res.status(201).json({ 
      success: true,
      message: "Order placed successfully!", 
      order: savedOrder 
    });

  } catch (err) {
    console.error("Order Creation Error:", err.message);
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
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    
    res.status(200).json({ 
      success: true, 
      count: orders.length,
      orders 
    }); 
  } catch (err) {
    console.error("Fetch Orders Error:", err.message);
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
      .populate("userId", "name email") 
      .sort({ createdAt: -1 });
      
    res.status(200).json(allOrders);
  } catch (err) {
    res.status(500).json({ message: "Admin: Failed to retrieve total order list." });
  }
});

/**
 * @route   PATCH /api/orders/:id/status
 * @desc    Admin: Update order status
 * @access  Private (Admin only)
 */
router.patch("/:id/status", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["Pending", "Processing", "Preparing", "Shipped", "Delivered", "Completed", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
    }

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    res.json({ success: true, order: updated });
  } catch (err) {
    console.error("Order Status Update Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to update order status." });
  }
});

module.exports = router;