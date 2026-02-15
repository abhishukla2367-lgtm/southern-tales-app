const Cart = require("../models/Cart");

/**
 * @desc    Requirement #8: Added items should appear in Cart
 * @route   GET /api/cart
 * @access  Private (Task 4)
 */
exports.getCart = async (req, res) => {
  try {
    // Task 2: Fetch user-specific cart from MongoDB Atlas
    const cart = await Cart.findOne({ user: req.user.id });
    
    // Return empty structure if no cart exists to prevent Frontend .map() crashes
    if (!cart) {
      return res.status(200).json({ items: [], totalBill: 0 });
    }
    
    res.status(200).json(cart);
  } catch (error) {
    console.error("Fetch Cart Error:", error.message);
    res.status(500).json({ message: "Error fetching cart data" });
  }
};

/**
 * @desc    Requirement #8: Store items in database
 * @route   POST /api/cart/add
 * @access  Private (Task 4)
 */
exports.addToCart = async (req, res) => {
  const { productId, name, price, quantity, image } = req.body;
  const userId = req.user.id;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      // Task 8.2: Check if item already exists to update quantity instead of duplicating
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId.toString()
      );

      if (itemIndex > -1) {
        // Update existing item quantity
        cart.items[itemIndex].quantity += Number(quantity);
      } else {
        // Add new item to existing cart array
        cart.items.push({ 
          productId, 
          name, 
          price: Number(price), 
          quantity: Number(quantity), 
          image 
        });
      }
      
      // Professional Recalculation of total bill
      cart.totalBill = cart.items.reduce(
        (acc, curr) => acc + (curr.price * curr.quantity), 0
      );
      
      await cart.save();
    } else {
      // FIX: Correctly initialize the items array when creating a new cart
      const totalBill = Number(price) * Number(quantity);
      cart = await Cart.create({
        user: userId,
        items:
        totalBill
      });
    }
    
    res.status(201).json(cart);
  } catch (error) {
    console.error("Add to Cart Error:", error.message);
    res.status(500).json({ 
      message: "Failed to add item to cart", 
      error: error.message 
    });
  }
};

/**
 * @desc    Requirement #8.2: User can delete cart items
 * @route   DELETE /api/cart/:productId
 * @access  Private
 */
exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (cart) {
      // Remove specific product from the items array
      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId.toString()
      );
      
      // Update bill after removal
      cart.totalBill = cart.items.reduce(
        (acc, curr) => acc + (curr.price * curr.quantity), 0
      );
      
      await cart.save();
      return res.status(200).json(cart);
    }
    
    res.status(404).json({ message: "Cart not found" });
  } catch (error) {
    console.error("Remove Item Error:", error.message);
    res.status(500).json({ message: "Error deleting item from cart" });
  }
};

/**
 * @desc    Requirement #8.3: Remove items from cart on placing order
 * @route   DELETE /api/cart/clear
 * @access  Private
 */
exports.clearCart = async (req, res) => {
  try {
    // Task 8.3: Completely clear the user's cart upon successful order placement
    await Cart.findOneAndDelete({ user: req.user.id });
    res.status(200).json({ 
      success: true, 
      message: "Cart cleared successfully" 
    });
  } catch (error) {
    console.error("Clear Cart Error:", error.message);
    res.status(500).json({ message: "Could not clear cart" });
  }
};
