const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  // ✅ FIX: Removed custom string _id — using Mongoose ObjectId instead
  // This ensures compatibility with ObjectId.isValid() checks in menuController.js
  name: {
    type: String,
    required: [true, "Dish name is required"],
    trim: true
  },
  description: {
    type: String,
    default: ""          // ✅ FIX: Made optional to avoid unhandled Mongoose errors
                         // when admin creates item without description
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"]   // ✅ FIX: Prevent negative prices
  },
  category: {
    type: String,
    required: true,
    // no enum — admin can freely add any category from the frontend
  },
  image: {
    type: String,
    default: ""          // ✅ FIX: Made optional — controller handles missing images gracefully
  },
  veg: {
    type: Boolean,
    default: true
  },
  vegan: {
    type: Boolean,
    default: false
  },
  dietary: {
    type: Boolean,
    default: false
  },
  available: {           // matches frontend and menuController.js
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: "menu"     // ✅ _id: false removed — Mongoose now auto-generates ObjectIds
});

module.exports = mongoose.model("Menu", menuSchema);