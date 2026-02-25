const Menu      = require("../models/Menu");
const mongoose  = require("mongoose");

// ── Helpers ────────────────────────────────────────────────────────────────

/** FormData sends everything as strings — coerce safely */
const toNumber  = (v) => (v !== undefined && v !== "" ? Number(v)        : undefined);
const toBool    = (v) => (v !== undefined && v !== "" ? v !== "false"    : undefined);

// ── GET all menu items (supports ?category= filter) ───────────────────────
const getAllMenuItems = async (req, res) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const menuItems = await Menu.find(filter).sort({ createdAt: -1 });
    res.status(200).json(menuItems);
  } catch (err) {
    console.error("❌ Get Menu Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch menu items", error: err.message });
  }
};

// ── POST create new menu item ──────────────────────────────────────────────
const createMenuItem = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    // Coerce FormData strings to correct types
    const price     = toNumber(req.body.price);
    const veg       = toBool(req.body.veg);
    const available = toBool(req.body.available);

    // Image URL comes from multer-cloudinary, not req.body
    const image = req.file?.path;

    // Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "name, price, and category are required",
      });
    }

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "image is required — ensure the route has upload.single('image') middleware",
      });
    }

    const newItem = await Menu.create({
      name,
      description,
      price,
      category,
      image,
      veg:       veg       ?? true,
      available: available ?? true,
    });

    console.log("✅ Menu item created:", newItem._id);
    res.status(201).json(newItem);
  } catch (err) {
    console.error("❌ Admin Add Error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── PUT update menu item (edit + toggle availability) ─────────────────────
const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid menu item ID" });
    }

    const { name, description, category } = req.body;

    // Coerce FormData strings to correct types
    const price     = toNumber(req.body.price);
    const veg       = toBool(req.body.veg);
    const available = toBool(req.body.available);

    // Use newly uploaded image if provided, otherwise fall back to existing URL in body
    const image = req.file?.path || req.body.image;

    // Build update object — only include fields that were actually sent
    const updates = {
      ...(name        !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price       !== undefined && { price }),
      ...(category    !== undefined && { category }),
      ...(image       !== undefined && { image }),
      ...(veg         !== undefined && { veg }),
      ...(available   !== undefined && { available }),
    };

    const updatedItem = await Menu.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }

    console.log("✅ Menu item updated:", id);
    res.status(200).json(updatedItem);
  } catch (err) {
    console.error("❌ Update Error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── DELETE menu item ───────────────────────────────────────────────────────
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid menu item ID" });
    }

    const deletedItem = await Menu.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }

    console.log("✅ Menu item deleted:", id);
    res.status(200).json({ success: true, message: "Menu item deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to delete menu item", error: err.message });
  }
};

module.exports = { getAllMenuItems, createMenuItem, updateMenuItem, deleteMenuItem };