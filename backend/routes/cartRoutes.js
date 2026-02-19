const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const { protect } = require("../middleware/protect");

// @desc    Task 8: Added items should appear in Cart
// @route   GET /api/cart
router.get("/", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }); // FIX: userId
    if (!cart) return res.json({ items: [], totalBill: 0 }); // FIX: totalBill
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server Error fetching cart" });
  }
});

// @desc    Task 8: Store items in database
// @route   POST /api/cart/add
router.post("/add", protect, async (req, res) => {
  const { productId, name, price, quantity, image } = req.body;

  try {
    let cart = await Cart.findOne({ userId: req.user.id }); // FIX: userId

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (p) => p.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += Number(quantity);
      } else {
        cart.items.push({ productId, name, price, quantity: Number(quantity), image });
      }

      // FIX: totalBill
      cart.totalBill = cart.items.reduce(
        (acc, curr) => acc + curr.price * curr.quantity, 0
      );
      cart = await cart.save();
    } else {
      cart = await Cart.create({
        userId: req.user.id, // FIX: userId
        items: [{ productId, name, price, quantity: Number(quantity), image }],
        totalBill: Number(price) * Number(quantity) // FIX: totalBill
      });
    }

    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error: error.message });
  }
});

// @desc    Task 8: User can delete cart items
// @route   DELETE /api/cart/item/:productId
router.delete("/item/:productId", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }); // FIX: userId

    if (cart) {
      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== req.params.productId
      );

      // FIX: totalBill
      cart.totalBill = cart.items.reduce(
        (acc, curr) => acc + curr.price * curr.quantity, 0
      );

      await cart.save();
      return res.json(cart);
    }

    res.status(404).json({ message: "Cart not found" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item" });
  }
});

// @desc    Task 8.2: Remove items from cart on placing order
// @route   DELETE /api/cart/clear
router.delete("/clear", protect, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user.id }); // FIX: userId
    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart" });
  }
});

module.exports = router;