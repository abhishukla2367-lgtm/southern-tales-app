const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    // Task 6 & 8: Changed from 'user' to 'userId' for consistency with Reservations
    userId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true, // Ensuring every order belongs to someone
      index: true     // Speeds up "My Orders" queries significantly
    },
    // Task 8: Detailed item tracking
    items: [
      {
        productId: {
          type: String, 
        },
        name: { type: String, required: true },
        quantity: { 
          type: Number, 
          required: true, 
          min: [1, "Quantity cannot be less than 1"] 
        },
        price: { type: Number, required: true },
      },
    ],
    // Professional Detail: Required for Task 8 checkout flow
    deliveryInfo: {
      address: { type: String, required: true },
      phone: { type: String, required: true }
    },
    // Task 8: Validation to prevent negative billing
    totalAmount: { 
      type: Number, 
      required: true,
      min: [0, "Total amount cannot be negative"] 
    },
    // Task 8.3: Professional status management for Admin Dashboard
    status: {
      type: String,
      default: "Pending",
      enum: {
        values: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        message: '{VALUE} is not a supported order status'
      }
    },
    paymentStatus: {
      type: String,
      default: "Unpaid",
      enum: ["Unpaid", "Paid", "Refunded"]
    }
  },
  // Requirement #6: Essential for sorting "My Orders" by the newest date
  { 
    timestamps: true 
  }
);

module.exports = mongoose.model("Order", OrderSchema);