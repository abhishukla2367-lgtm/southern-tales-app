const express = require("express");
const router = express.Router();
const MenuItem = require("../models/Menu"); // FIX: Import from dedicated model file
const { protect, admin } = require("../middleware/protect"); // FIX: Import middleware

// --- PUBLIC ROUTE: GET ALL MENU ITEMS ---
// No auth required — users can browse without login
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

// --- ADMIN ROUTE: ADD NEW ITEM ---
// FIX: Added protect + admin middleware
router.post("/add", protect, admin, async (req, res) => {
  try {
    const newItem = new MenuItem(req.body);
    await newItem.save();
    res.status(201).json({ success: true, message: "Item added successfully!" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// --- ADMIN ROUTE: UPDATE ITEM ---
// FIX: Added protect + admin middleware
router.patch("/:id", protect, admin, async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
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

// --- ADMIN ROUTE: DELETE ITEM ---
// FIX: Added protect + admin middleware
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});

module.exports = router;