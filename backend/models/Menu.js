const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  _id: { 
    type: String                          // ✅ custom string IDs like "a1", "b2", etc.
  },
  name: { 
    type: String, 
    required: [true, "Dish name is required"], 
    trim: true 
  },
  description: { 
    type: String, 
    required: [true, "Description is required"] 
  },
  price: { 
    type: Number,
    required: [true, "Price is required"] 
  },
  category: { 
    type: String, 
    required: true,
    // no enum — admin can freely add any category from the frontend
  },
  image: { 
    type: String, 
    required: true
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
  available: {                  // ✅ renamed from isAvailable → matches frontend
    type: Boolean, 
    default: true
  }
}, { 
  timestamps: true,
  collection: "menu",
  _id: false,                   // ✅ disable auto ObjectId generation — we supply our own
});

module.exports = mongoose.model("Menu", menuSchema);