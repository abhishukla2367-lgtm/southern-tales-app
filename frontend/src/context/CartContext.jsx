import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Named export for the Context object
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const navigate = useNavigate();

  // 1. Initialise from LocalStorage (Professional Persistence)
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

  // 2. Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem("restro_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  /**
   * TASK 8: Add to Cart
   * Check login status before adding (Task 4)
   */
  const addToCart = (item, isLoggedIn) => {
    if (!isLoggedIn) {
      alert("Please login to add items to your cart.");
      navigate("/login");
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        return prev.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (name) => {
    setCartItems((prev) => prev.filter((item) => item.name !== name));
  };

  const increaseQty = (name) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.name === name ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (name) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.name === name && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("restro_cart");
  };

  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
        0
      ),
    [cartItems]
  );

  /**
   * TASK 8: Place Order (MongoDB Atlas Integration)
   */
  const placeOrder = async (user, deliveryDetails = {}) => {
    if (!user?._id) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return { success: false };
    }

    setIsPlacingOrder(true);
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,           // Task 2: MongoDB ID
          customerName: user.name,
          email: user.email,
          items: cartItems,
          totalAmount: totalPrice,
          orderType: orderType,
          address: deliveryDetails.address || "N/A",
          status: "Pending",          // For Admin Side (Task 8)
          createdAt: new Date()
        }),
      });

      if (response.ok) {
        clearCart(); // Requirement: Remove items from cart on success
        alert("Order Placed Successfully!");
        navigate("/profile"); // Task 6: Show Orders in Profile
        return { success: true };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save order");
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
        increaseQty,
        decreaseQty,
        clearCart,
        totalPrice,
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

// ✅ Custom hook for components to use
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
