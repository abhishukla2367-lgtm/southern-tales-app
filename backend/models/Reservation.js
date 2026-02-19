const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerName: {
      type: String,
      required: true
    },
    customerEmail: {
      type: String,
      required: true
    },
    phone: {
      type: String,  // ✅ Added to store phone from Reservation form
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
      default: "TBD"
    }, 
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
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", ReservationSchema);