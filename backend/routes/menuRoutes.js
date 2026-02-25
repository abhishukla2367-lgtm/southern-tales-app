const express = require("express");
const router = express.Router();
const MenuItem = require("../models/Menu");
const { protect, admin } = require("../middleware/protect");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const mongoose = require("mongoose");

// --- MULTER SETUP ---
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// --- CLOUDINARY UPLOAD HELPER ---
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "southern_tales_menu", use_filename: true },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// --- 1. PUBLIC ROUTE: GET ALL MENU ITEMS (WITH CUSTOM SORT + CATEGORY FILTER) ---
router.get("/", async (req, res) => {
  try {
    // ✅ FIX: Support ?category= filter from menuController pattern
    const filter = req.query.category ? { category: req.query.category } : {};
    const items = await MenuItem.find(filter);

    // Define the professional category sequence
    const categoryOrder = [
      "breakfast",
      "starters",
      "main-course",
      "desserts",
      "beverages",
    ];

    // Sort by category order, then alphabetically by name within same category
    const sortedItems = items.sort((a, b) => {
      const indexA = categoryOrder.indexOf(a.category?.toLowerCase());
      const indexB = categoryOrder.indexOf(b.category?.toLowerCase());

      if (indexA === indexB) return a.name.localeCompare(b.name);
      if (indexA === -1) return 1;   // unknown categories go to end
      if (indexB === -1) return -1;

      return indexA - indexB;
    });

    res.status(200).json(sortedItems);
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching menu data" });
  }
});

// --- 2. ADMIN ROUTE: ADD NEW ITEM ---
router.post("/", protect, admin, upload.single("image"), async (req, res) => {
  try {
    let imageUrl = "";
    let cloudinaryId = "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl     = result.secure_url;
      cloudinaryId = result.public_id;
    }

    // ✅ FIX: Whitelist fields instead of spreading entire req.body
    // Prevents malicious overwrite of protected fields
    const { name, description, price, category, veg, vegan, dietary, available } = req.body;

    // ✅ FIX: Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: "name, price, and category are required" });
    }

    const newItem = new MenuItem({
      name,
      description:  description  || "",
      price:        Number(price),
      category,
      image:        imageUrl,
      cloudinaryId, // ✅ Ensure cloudinaryId field exists in Menu.js schema
      veg:          veg       ?? true,
      vegan:        vegan     ?? false,
      dietary:      dietary   ?? false,
      available:    available ?? true,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error("❌ Admin Add Error:", err.message);
    res.status(400).json({ success: false, message: "Upload failed", error: err.message });
  }
});

// --- 3. ADMIN ROUTE: UPDATE ITEM ---
// ✅ FIX: Added missing PUT route — admin can now edit existing menu items
router.put("/:id", protect, admin, upload.single("image"), async (req, res) => {
  try {
    // ✅ FIX: Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid menu item ID" });
    }

    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }

    let imageUrl     = item.image;
    let cloudinaryId = item.cloudinaryId;

    // If a new image is uploaded, delete old one from Cloudinary and upload new
    if (req.file) {
      if (item.cloudinaryId) {
        await cloudinary.uploader.destroy(item.cloudinaryId);
      }
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl     = result.secure_url;
      cloudinaryId = result.public_id;
    }

    // ✅ FIX: Whitelist allowed fields for update
    const { name, description, price, category, veg, vegan, dietary, available } = req.body;

    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name,
          description,
          price:    price ? Number(price) : item.price,
          category,
          image:    imageUrl,
          cloudinaryId,
          veg,
          vegan,
          dietary,
          available,
        },
      },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedItem);
  } catch (err) {
    console.error("❌ Admin Update Error:", err.message);
    res.status(400).json({ success: false, message: "Update failed", error: err.message });
  }
});

// --- 4. ADMIN ROUTE: DELETE ITEM ---
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    // ✅ FIX: Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid menu item ID" });
    }

    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    // Delete image from Cloudinary before removing DB record
    if (item.cloudinaryId) {
      await cloudinary.uploader.destroy(item.cloudinaryId);
    }

    await MenuItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Item and image deleted successfully" });
  } catch (err) {
    console.error("❌ Admin Delete Error:", err.message);
    res.status(500).json({ success: false, message: "Delete failed", error: err.message });
  }
});

module.exports = router;