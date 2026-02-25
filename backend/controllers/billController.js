const Order = require("../models/Order");
const mongoose = require("mongoose");

const TAX_RATE = 0.05; // 5% GST — adjust as needed

// GET /api/bill/:orderId — Generate bill for an order
const generateBill = async (req, res) => {
  try {
    // ✅ FIX: Validate ObjectId format before querying
    if (!mongoose.Types.ObjectId.isValid(req.params.orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(req.params.orderId).populate(
      "userId",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const subtotal = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
    const total = parseFloat((subtotal + tax).toFixed(2));

    res.json({
      orderId: order._id,
      orderType: order.orderType,
      customer: {
        name: order.userId?.name || order.guestName || "Walk-in Guest",
        email: order.userId?.email || "—",
      },
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: parseFloat((item.price * item.quantity).toFixed(2)),
      })),
      subtotal,
      tax,
      total,
      paymentStatus: order.paymentStatus,
      status: order.status,
      createdAt: order.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate bill", error: err.message });
  }
};

// PATCH /api/bill/:orderId/pay — Mark order as paid
const markAsPaid = async (req, res) => {
  try {
    // ✅ FIX: Validate ObjectId format before querying
    if (!mongoose.Types.ObjectId.isValid(req.params.orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    // ✅ FIX: Fetch first to check current payment status
    const existingOrder = await Order.findById(req.params.orderId);
    if (!existingOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ FIX: Prevent marking an already paid order as paid again
    if (existingOrder.paymentStatus === "Paid") {
      return res.status(400).json({ message: "Order is already marked as paid" });
    }

    // ✅ FIX: Use `new: true` instead of `returnDocument: 'after'` (Mongoose syntax)
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { paymentStatus: "Paid" },
      { new: true }
    );

    res.json({ message: "Order marked as paid", paymentStatus: order.paymentStatus });
  } catch (err) {
    res.status(500).json({ message: "Failed to update payment status", error: err.message });
  }
};

module.exports = { generateBill, markAsPaid };