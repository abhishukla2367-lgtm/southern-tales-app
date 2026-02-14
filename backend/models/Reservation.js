const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema(
  {
    // TASK 2 & 6: Links reservation to a specific User
    // Changed 'user' to 'userId' to match your Profile Controller query
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // TASK 7: Admin needs these details visible on the Admin Side
    customerName: {
      type: String,
      required: true
    },
    customerEmail: {
      type: String,
      required: true
    },
    date: { 
      type: Date, 
      required: true 
    },
    time: { 
      type: String, 
      required: true 
    },
    guests: { 
      type: Number, 
      required: true,
      min: [1, "Must have at least 1 guest"]
    },
    tableNumber: { 
      type: String,
      default: "TBD" // Set to To Be Decided initially
    }, 
    // TASK 7: Helps Admin manage the reservation flow
    status: {
      type: String,
      default: "Confirmed",
      enum: ["Confirmed", "Cancelled", "Completed"],
    },
    specialRequests: {
      type: String,
      trim: true,
      default: ""
    }
  },
  // TASK 6: Timestamps allow sorting "My Reservations" by newest first
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", ReservationSchema);
