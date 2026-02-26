const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // ✅ FIX: Changed to required: false — walk-in orders have no authenticated userId
      required: false,
      index: true,
    },

    // "walkin" orders won't have userId from auth — use guestName instead
    orderType: {
      type: String,
      default: "delivery",
      enum: ["delivery", "walkin"],
    },

    guestName: {
      type: String, // Used for walk-in customers
    },

    items: [
      {
        // ✅ FIX: Changed from ObjectId to Mixed to support both standard ObjectIds
        // and custom _id values (e.g. "a2", "a3") that exist in the menu collection
        productId: {
          type: mongoose.Schema.Types.Mixed,
          ref: "Menu"
        },
        name: { type: String, required: true },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity cannot be less than 1"],
        },
        // ✅ FIX: Added min validator to prevent negative or zero prices
        price: {
          type: Number,
          required: true,
          min: [0, "Price cannot be negative"]
        },
      },
    ],

    // Optional for walk-in orders
    deliveryInfo: {
      address: { type: String },
      phone:   { type: String },
    },

    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
    },

    // ✅ FIX: Removed "Shipped" — not applicable for a restaurant system
    status: {
      type: String,
      default: "Pending",
      enum: {
        values: [
          "Pending",
          "Processing",
          "Preparing",
          "Delivered",
          "Completed",
          "Cancelled",
        ],
        message: "{VALUE} is not a supported order status",
      },
    },

    paymentStatus: {
      type: String,
      default: "Unpaid",
      enum: ["Unpaid", "Paid", "Refunded"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);