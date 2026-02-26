const Order      = require('../models/Order');
const Cart       = require('../models/Cart');
const MenuItem   = require('../models/Menu');
const mongoose   = require('mongoose');

// ─── Helper: Decrement stock atomically for all ordered items ─────────────────
// ✅ FIX: Use raw MongoDB driver to avoid Mongoose CastError on non-ObjectId _id values (e.g. "a10")
const decrementStock = async (items) => {
  const collection = mongoose.connection.db.collection("menu");
  await Promise.all(
    items.map(({ productId, itemId, menuItemId, quantity }) => {
      const id = productId || itemId || menuItemId;
      return collection.updateOne(
        { _id: id },
        [
          // Step 1: Subtract quantity, floor at 0
          { $set: { stock: { $max: [0, { $subtract: ["$stock", quantity] }] } } },
          // Step 2: Sync available flag from updated stock
          { $set: { available: { $gt: ["$stock", 0] } } },
        ]
      );
    })
  );
};

/**
 * @desc    Place order, validate stock, decrement stock, store in DB, clear cart
 * @route   POST /api/orders
 * @access  Private
 */
exports.placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, deliveryInfo } = req.body;

    // ── Auth check ───────────────────────────────────────────────────────────
    if (!req.user || (!req.user.id && !req.user._id)) {
      return res.status(401).json({ success: false, message: "Authentication failed. No user found." });
    }

    // ── Validate items ───────────────────────────────────────────────────────
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Order must contain at least one item." });
    }

    // ── Validate totalAmount ─────────────────────────────────────────────────
    if (!totalAmount || Number(totalAmount) <= 0) {
      return res.status(400).json({ success: false, message: "Invalid total amount." });
    }

    // ── Validate deliveryInfo ────────────────────────────────────────────────
    if (!deliveryInfo?.address?.trim() || !deliveryInfo?.phone?.trim()) {
      return res.status(400).json({ success: false, message: "Delivery address and phone are required." });
    }

    // ── Stock validation: check ALL items BEFORE touching the DB ─────────────
    // ✅ FIX: Use raw MongoDB driver — avoids CastError for non-ObjectId _id values like "a10"
    const menuItemIds  = items.map((i) => i.productId || i.itemId || i.menuItemId);
    const collection   = mongoose.connection.db.collection("menu");
    const menuItemDocs = await collection.find({ _id: { $in: menuItemIds } }).toArray();

    // Build a quick lookup map
    const stockMap = Object.fromEntries(menuItemDocs.map((m) => [m._id.toString(), m]));

    for (const { productId, itemId, menuItemId, quantity, name } of items) {
      // ✅ FIX: support productId (frontend) as well as itemId/menuItemId (legacy)
      const id       = (productId || itemId || menuItemId)?.toString();
      const menuItem = stockMap[id];

      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: `Menu item not found: ${name || id}`,
        });
      }

      if (menuItem.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `"${menuItem.name}" only has ${menuItem.stock} unit(s) left.`,
          itemId: id,
          availableStock: menuItem.stock,
        });
      }
    }

    // ── Atomically decrement stock for each ordered item ─────────────────────
    await decrementStock(items);

    // ── Create the order ─────────────────────────────────────────────────────
    const userId   = new mongoose.Types.ObjectId(req.user.id || req.user._id);
    const newOrder = await Order.create({
      userId,
      items,
      totalAmount,
      deliveryInfo,
      status:        "Pending",
      paymentStatus: "Unpaid",
    });

    // ── Clear the cart ────────────────────────────────────────────────────────
    await Cart.findOneAndDelete({ userId });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      order:   newOrder,
    });

  } catch (err) {
    console.error("❌ Order Placement Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * @desc    Get orders for logged-in user (Profile page)
 * @route   GET /api/orders/my
 * @access  Private
 */
exports.getMyOrders = async (req, res) => {
  try {
    if (!req.user || (!req.user.id && !req.user._id)) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const userId = new mongoose.Types.ObjectId(req.user.id || req.user._id);
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    console.log(`📡 Orders for ${userId}: ${orders.length} found`);

    return res.status(200).json({
      success: true,
      count:   orders.length,
      orders,
    });

  } catch (err) {
    console.error("❌ getMyOrders Error:", err.message);
    return res.status(500).json({ success: false, error: "Failed to fetch your orders." });
  }
};

/**
 * @desc    Get all orders (Admin panel)
 * @route   GET /api/orders/admin
 * @access  Private — Admin only
 */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count:   orders.length,
      orders,
    });

  } catch (err) {
    console.error("❌ Admin Fetch Error:", err.message);
    return res.status(500).json({ success: false, error: "Failed to fetch admin order list." });
  }
};

/**
 * @desc    Restock a menu item (Admin)
 * @route   PATCH /api/menu/:id/restock
 * @access  Private — Admin only
 */
exports.restockItem = async (req, res) => {
  const { id }       = req.params;
  const { quantity } = req.body;

  if (!quantity || Number(quantity) <= 0) {
    return res.status(400).json({ success: false, message: "Quantity must be a positive number." });
  }

  try {
    // ✅ FIX: Use raw driver to avoid CastError on non-ObjectId _id values
    const collection = mongoose.connection.db.collection("menu");
    const result     = await collection.findOneAndUpdate(
      { _id: id },
      [
        { $set: { stock: { $add: ["$stock", Number(quantity)] } } },
        { $set: { available: { $gt: ["$stock", 0] } } },
      ],
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: "Menu item not found." });
    }

    return res.status(200).json({
      success: true,
      message: `Restocked "${result.name}" by ${quantity} units.`,
      item:    result,
    });

  } catch (err) {
    console.error("❌ Restock Error:", err.message);
    return res.status(500).json({ success: false, error: "Failed to restock item." });
  }
};