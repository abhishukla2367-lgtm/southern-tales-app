import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  // FIX: Default to empty string so Delivery apps are hidden until clicked
  const [orderType, setOrderType] = useState(""); 
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // FIX: Multi-item Logic (Appends new items, updates quantity for existing)
  const addToCart = (newItem) => {
    setCartItems((prevItems) => {
      const exists = prevItems.find((item) => item._id === newItem._id);
      if (exists) {
        return prevItems.map((item) =>
          item._id === newItem._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // If item is new, append it to the array
      return [...prevItems, { ...newItem, quantity: 1 }];
    });
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return removeFromCart(id);
    setCartItems((prev) =>
      prev.map((item) => (item._id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    setOrderType(""); // Reset order type on clear
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Header Count Logic: Sum of all quantities
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const placeOrder = async (user, deliveryDetails) => {
    setIsPlacingOrder(true);
    try {
      // Replace with your actual [API endpoint](https://developer.mozilla.org) logic
      console.log("Placing Order for:", user.name, deliveryDetails);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
      alert("Order Placed Successfully!");
      clearCart();
    } catch (error) {
      console.error("Order Failed", error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
        orderType,
        setOrderType,
        placeOrder,
        isPlacingOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
