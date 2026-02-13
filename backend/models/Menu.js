const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
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
    type: Number, // Must be Number for frontend price filters to work
    required: [true, "Price is required"] 
  },
  category: { 
    type: String, 
    required: true,
    enum: ["Breakfast", "Starters", "Main Course", "Desserts", "Beverages"] // Matches your frontend categories
  },
  image: { 
    type: String, 
    required: true // Should match keys in your frontend imageMap (e.g., "plainDosa")
  },
  veg: { 
    type: Boolean, 
    default: true // Used for your "Dietary" filter
  },
  isAvailable: { 
    type: Boolean, 
    default: true // Useful for Admin side management
  }
}, { 
  timestamps: true, // Automatically adds createdAt and updatedAt
  collection: 'menu' // 👈 FORCES Mongoose to use the singular 'menu' collection in Atlas
});

module.exports = mongoose.model("Menu", menuSchema);
