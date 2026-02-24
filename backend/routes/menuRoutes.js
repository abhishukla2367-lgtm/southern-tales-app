const express = require("express");
const router = express.Router();
const MenuItem = require("../models/Menu");
const { protect, admin } = require("../middleware/protect");

// --- PUBLIC ROUTE: GET ALL MENU ITEMS ---
// No auth required — users can browse without login
router.get("/", async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    console.log(`✅ Found ${items.length} items in Atlas.`);
    res.status(200).json(items);
  } catch (err) {
    console.error("❌ Fetch Menu Error:", err.message);
    res.status(500).json({ success: false, message: "Error fetching menu data" });
  }
});

// --- ADMIN ROUTE: ADD NEW ITEM ---
// FIX: Changed "/add" → "/" to match frontend API.post("/menu")
router.post("/", protect, admin, async (req, res) => {
  try {
    const newItem = new MenuItem(req.body);
    await newItem.save();
    res.status(201).json(newItem); // FIX: Return the created item (frontend needs it to update state)
  } catch (err) {
    console.error("❌ Admin Add Error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

// --- ADMIN ROUTE: UPDATE ITEM ---
// FIX: Changed PATCH → PUT to match frontend API.put("/menu/:id")
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    res.status(200).json(updatedItem); // FIX: Return updated item directly (frontend needs it to update state)
  } catch (err) {
    console.error("❌ Admin Update Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to update item" });
  }
});

// --- ADMIN ROUTE: DELETE ITEM ---
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    res.status(200).json({ success: true, message: "Item deleted successfully" });
  } catch (err) {
    console.error("❌ Admin Delete Error:", err.message);
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});

module.exports = router;