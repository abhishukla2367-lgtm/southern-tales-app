import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Named export for the Context object
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const navigate = useNavigate();

  // 1. Initialize from LocalStorage (Requirement #8: Persistence)
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
        // Ensure price is treated as a number immediately
        return [...prev, { ...item, quantity: 1, price: Number(item.price) }];
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
    if (newQty < 1) {
      removeFromCart(id); // If quantity drops below 1, remove it
      return;
    }
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
   * Uses Number() casting to prevent string concatenation bugs
   */
  const getCartTotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
      0
    ).toFixed(2); // Keeps currency formatting consistent
  };

  /**
   * TASK 8.3: Place Order (Backend Integration)
   * Stores order in MongoDB Atlas and clears the cart on success
   */
  const placeOrder = async (user, deliveryDetails = {}) => {
    // Basic validation to prevent crashes
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
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      // Consolidate delivery details from either arguments or user profile
      const address = deliveryDetails.address || user.address || "";
      const phone = deliveryDetails.phone || user.phone || user.phoneNumber || "";

      // Validate delivery info for "delivery" orders
      if (orderType === "delivery" && (!address || !phone)) {
        alert("Please provide a delivery address and contact phone number.");
        setIsPlacingOrder(false);
        return { success: false };
      }

      const payload = {
        items: cartItems,
        totalAmount: Number(getCartTotal()),
        orderType,
        deliveryInfo: {
          address,
          phone,
        },
      };

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        clearCart(); 
        alert("Order Placed Successfully!");
        navigate("/profile"); // Requirement #6: Navigate to profile to see 'My Orders'
        return { success: true };
      } else {
        throw new Error(data.message || "Failed to process order");
      }
    } catch (error) {
      console.error("Order Integration Error:", error);
      alert("Order Error: " + error.message);
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

// ✅ Custom hook for easy access
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};