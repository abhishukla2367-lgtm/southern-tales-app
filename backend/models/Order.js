const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    // Requirement #2 & #6: Links order to User and improves search performance with an index
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Order must belong to a user"],
      index: true, 
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

// Professional Touch: Virtual field or indexes can be added here if needed
// Exporting the model for use in Task 8 Controllers
module.exports = mongoose.model("Order", OrderSchema);
