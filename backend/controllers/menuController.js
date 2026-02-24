const Menu = require("../models/Menu");

// ── GET all menu items ─────────────────────────────────────────────────────
const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find().sort({ createdAt: -1 });
    res.status(200).json(menuItems);
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch menu items", error: err.message });
  }
};

// ── POST create new menu item ──────────────────────────────────────────────
const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, image, veg, available } = req.body;

    const newItem = await Menu.create({
      name,
      description,
      price,
      category,
      image,
      veg:       veg       ?? true,
      available: available ?? true,
    });

    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to create menu item", error: err.message });
  }
};

// ── PUT update menu item (edit + toggle availability) ─────────────────────
const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedItem = await Menu.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }

    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to update menu item", error: err.message });
  }
};

// ── DELETE menu item ───────────────────────────────────────────────────────
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedItem = await Menu.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }

    res.status(200).json({ success: true, message: "Menu item deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete menu item", error: err.message });
  }
};

module.exports = { getAllMenuItems, createMenuItem, updateMenuItem, deleteMenuItem };