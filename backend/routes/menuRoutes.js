const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// --- 1. DEFINE THE MENU SCHEMA (Requirement #2) ---
const menuSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    required: true,
    enum: ["Breakfast", "Starters", "Main Course", "Desserts", "Beverages"] // Matches Frontend
  },
  price: { type: Number, required: true }, // Must be Number for Frontend filters
  veg: { type: Boolean, default: true },
  description: { type: String },
  image: { type: String, required: true }, // Matches frontend imageMap keys
  available: { type: Boolean, default: true }
}, { 
  timestamps: true,
  collection: "menu" // 👈 CRITICAL: This forces Mongoose to use your 'menu' collection in Atlas
});

// Prevent model overwrite error in development
const MenuItem = mongoose.models.MenuItem || mongoose.model("MenuItem", menuSchema);

// --- 2. PUBLIC ROUTE: GET ALL MENU ITEMS (Task #4) ---
// Requirement: Allow users to browse website without login
router.get("/", async (req, res) => {
  try {
    const items = await MenuItem.find();
    console.log(`✅ Found ${items.length} items in Atlas.`);
    res.status(200).json(items);
  } catch (err) {
    console.error("❌ Fetch Menu Error:", err.message);
    res.status(500).json({ success: false, message: "Error fetching menu data" });
  }
});

// --- 3. ADMIN ROUTE: UPDATE ITEM (Task #7 & #8) ---
// Used for Admin Dashboard to manage Menu items
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = await MenuItem.findByIdAndUpdate(
      id,
      { $set: req.body }, // Can update price, availability, or category
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    res.status(200).json({ success: true, item: updatedItem });
  } catch (err) {
    console.error("❌ Admin Update Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to update item" });
  }
});

// --- 4. ADMIN ROUTE: ADD NEW ITEM (Task #7) ---
router.post("/add", async (req, res) => {
  try {
    const newItem = new MenuItem(req.body);
    await newItem.save();
    res.status(201).json({ success: true, message: "Item added to Atlas successfully!" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// --- 5. ADMIN ROUTE: DELETE ITEM (Task #7) ---
router.delete("/:id", async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});

module.exports = router;
