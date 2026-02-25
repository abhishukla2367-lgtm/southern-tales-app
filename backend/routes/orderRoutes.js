const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/Order");

// ✅ FIX: Import controller functions instead of duplicating logic inline
const {
  placeOrder,
  getMyOrders,
  getAllOrders,
} = require("../controllers/orderController");

const { protect, admin } = require("../middleware/protect");

/**
 * @route   POST /api/orders
 * @desc    Task 8: Place order and clear cart
 * @access  Private (Login Required)
 */
router.post("/", protect, placeOrder);

/**
 * @route   GET /api/orders/my-orders
 * @desc    Task 6: Display "My Orders" in User Profile page
 * @access  Private
 * ⚠️ Must be defined BEFORE /:id to avoid Express treating "my-orders" as an id
 */
router.get("/my-orders", protect, getMyOrders);

/**
 * @route   GET /api/orders/admin/all
 * @desc    Task 8.3: Show all orders on Admin side
 * @access  Private (Admin only)
 */
router.get("/admin/all", protect, admin, getAllOrders);

/**
 * @route   PATCH /api/orders/:id/status
 * @desc    Admin: Update order status
 * @access  Private (Admin only)
 */
router.patch("/:id/status", protect, admin, async (req, res) => {
  try {
    // ✅ FIX: Validate ObjectId to avoid Mongoose CastError
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid order ID" });
    }

    const { status } = req.body;

    // ✅ FIX: Removed "Shipped" — not in Order.js enum, would cause Mongoose validation error
    const validStatuses = [
      "Pending",
      "Processing",
      "Preparing",
      "Delivered",
      "Completed",
      "Cancelled",
    ];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    res.status(200).json({ success: true, order: updated });
  } catch (err) {
    console.error("Order Status Update Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to update order status.",
      error: err.message,
    });
  }
});

module.exports = router;