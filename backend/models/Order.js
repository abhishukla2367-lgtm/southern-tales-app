const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },

    // delivery = online delivery
    // pickup   = customer picks up from restaurant
    // walkin   = customer walks in without reservation
    // dinein   = customer had a reservation and is now ordering
    orderType: {
      type: String,
      default: "delivery",
      enum: ["delivery", "pickup", "walkin", "dinein"],
    },

    // ── Walk-in / Dine-in fields ──────────────────────────────────────────
    guestName: {
      type: String, // Used when no userId (walk-in / dine-in)
    },

    tableNumber: {
      type: String, // Table number for walkin / dinein
    },

    numberOfGuests: {
      type: Number,
      min: [1, "At least 1 guest required"],
    },

    // ── Dine-in only — links to existing reservation ──────────────────────
    reservationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
      required: false,
    },

    // ── Order Items ───────────────────────────────────────────────────────
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.Mixed,
          ref: "Menu",
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity cannot be less than 1"],
        },
        price: {
          type: Number,
          required: true,
          min: [0, "Price cannot be negative"],
        },
        unit: {
          type: String, // plate, bowl, glass, pcs — from Menu collection
        },
      },
    ],

    // ── Delivery Info (delivery orders only) ─────────────────────────────
    deliveryInfo: {
      address: { type: String },
      phone:   { type: String },
    },

    // ── Financials ────────────────────────────────────────────────────────
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "UPI", "Card", "Online"],
      default: "Cash",
    },

    paymentStatus: {
      type: String,
      default: "Unpaid",
      enum: ["Unpaid", "Paid", "Refunded"],
    },

    // ── Order Status ──────────────────────────────────────────────────────
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

    // ── Optional Notes ────────────────────────────────────────────────────
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);