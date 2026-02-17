import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Named export for the Context object
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const navigate = useNavigate();

  // 1. Initialize from LocalStorage (Task #8: Persistence)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("restro_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error("Cart hydration failed:", e);
      return [];
    }
  });

  const [orderType, setOrderType] = useState("delivery");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // 2. Sync with LocalStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("restro_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  /**
   * TASK 8: Add to Cart
   * Requirement #4: Check login status before adding items
   */
  const addToCart = (item, isLoggedIn) => {
    if (!isLoggedIn) {
      alert("Please login to add items to your cart.");
      navigate("/login");
      return;
    }

    setCartItems((prev) => {
      // Use _id for consistent identification with MongoDB Atlas
      const existing = prev.find((i) => i._id === item._id);
      if (existing) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prev, { ...item, quantity: 1, price: Number(item.price) }];
      }
    });
  };

  /**
   * TASK 8.2: Remove item from cart
   */
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  /**
   * REPLACES increaseQty/decreaseQty
   * Fixes: "Uncaught TypeError: increaseQty is not a function"
   */
  const updateQuantity = (id, newQty) => {
    if (newQty < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("restro_cart");
  };

  /**
   * TASK 8.1: Calculation Logic for UI
   */
  const getCartTotal = () => {
    const total = cartItems.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
      0
    );
    return Number(total.toFixed(2));
  };

  /**
   * TASK 8.3: Place Order (Backend Integration)
   * Connects to MongoDB Atlas and satisfies Task 6 (Profile Page visibility)
   */
  const placeOrder = async (user, deliveryDetails = {}) => {
    if (!user || !user._id) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return { success: false };
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return { success: false };
    }

    setIsPlacingOrder(true);
    try {
      const token = localStorage.getItem("token"); // For secure API calls
      
      // Construct payload for MongoDB Atlas Schema
      const payload = {
        userId: user._id,
        userName: user.name, // Required for Admin Dashboard visibility
        items: cartItems,
        totalAmount: getCartTotal(),
        orderType,
        deliveryInfo: {
          address: deliveryDetails.address || "Store Pickup",
          time: deliveryDetails.time || "ASAP",
        },
        status: "Pending", // For Admin side management
        createdAt: new Date(),
      };

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "" 
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        clearCart(); 
        alert("Order Placed Successfully!");
        navigate("/profile"); // Task 6: Direct to profile to see My Orders
        return { success: true };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Server Error (500)");
      }
    } catch (error) {
      console.error("Order Integration Error:", error);
      alert("Order failed: " + error.message);
      return { success: false };
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity, // Used in CartDrawer for +/- buttons
        getCartTotal,   // Used for showing total price
        clearCart,
        orderType,
        setOrderType,
        placeOrder,
        isPlacingOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for easy access
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
