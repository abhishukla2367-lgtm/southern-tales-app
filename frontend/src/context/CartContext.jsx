import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Named export for the Context object
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const navigate = useNavigate();

  // 1. Initialise from LocalStorage (Requirement #8: Persistence)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("restro_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
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
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  /**
   * TASK 8.2: Remove single item from cart
   */
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  /**
   * Helper: Update Quantity
   * Consolidates increase/decrease logic for CartDrawer.jsx
   */
  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return; // Prevent quantity from going below 1
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  /**
   * Requirement #8.3: Remove all items after successful order
   */
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("restro_cart");
  };

  /**
   * TASK 8.1: Calculation Logic for UI
   */
  const getCartTotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
      0
    );
  };

  /**
   * TASK 8.3: Place Order (Backend Integration)
   * Stores order in MongoDB Atlas and clears the cart on success
   */
  const placeOrder = async (user, deliveryDetails = {}) => {
    if (!user?._id) {
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
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,           // Links to Requirement #6 (Profile History)
          customerName: user.name,
          email: user.email,
          items: cartItems,
          totalAmount: getCartTotal(),
          orderType: orderType,
          address: deliveryDetails.address || user.address || "N/A",
          status: "Pending",          // For Admin Dashboard (Requirement #8)
          createdAt: new Date()
        }),
      });

      if (response.ok) {
        clearCart(); // Requirement #8.3: Remove items from cart
        alert("Order Placed Successfully!");
        return { success: true };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to process order");
      }
    } catch (error) {
      console.error("Order Integration Error:", error);
      alert("Backend Error: " + error.message);
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
        updateQuantity,
        getCartTotal,
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

// ✅ Custom hook for easy access in components like CartDrawer.jsx
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
