const express = require("express");
const router = express.Router();

// ✅ FIX: Import controller functions instead of duplicating logic inline
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const { protect } = require("../middleware/protect");

/**
 * @route   GET /api/cart
 * @desc    Get current user's cart
 * @access  Private
 */
router.get("/", protect, getCart);

/**
 * @route   POST /api/cart/add
 * @desc    Add item to cart
 * @access  Private
 */
router.post("/add", protect, addToCart);

/**
 * @route   DELETE /api/cart/clear
 * @desc    Clear entire cart on order placement
 * @access  Private
 * ⚠️ Must be defined BEFORE /:productId to avoid Express treating "clear" as a productId
 */
router.delete("/clear", protect, clearCart);

/**
 * @route   DELETE /api/cart/:productId
 * @desc    Remove a single item from cart
 * @access  Private
 */
router.delete("/:productId", protect, removeFromCart);

module.exports = router;