import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const navigate = useNavigate();

  // 1. PERSISTENCE: Initialize from LocalStorage (Requirement: Professional State Management)
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("restro_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [orderType, setOrderType] = useState("delivery");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // 2. SYNC: Automatically update LocalStorage when cart changes
  useEffect(() => {
    localStorage.setItem("restro_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // 3. AUTH GUARDED ACTION (Requirement #4): Restrict Add to Cart
  const addToCart = (item, user) => {
    if (!user) {
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

  // 4. PLACE ORDER (Requirement #2 & #8): MongoDB Backend Integration
  const placeOrder = async (user, deliveryDetails = {}) => {
    if (!user) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return { success: false };
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return { success: false };
    }

    setIsPlacingOrder(true);
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,           // MongoDB ID from AuthContext
          customerName: user.name,
          email: user.email,
          items: cartItems,
          totalAmount: totalPrice,
          orderType: orderType,
          address: deliveryDetails.address || "N/A",
          platform: deliveryDetails.platform || "Direct",
          status: "Pending",          // For Admin Side Orders Page
          createdAt: new Date()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Requirement #8: Remove items from cart on success
        clearCart(); 
        alert("Order Placed Successfully!");
        navigate("/profile"); // Task #6: Show My Orders in Profile
        return { success: true };
      } else {
        throw new Error(data.message || "Failed to save order in database");
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

export const useCart = () => useContext(CartContext);
