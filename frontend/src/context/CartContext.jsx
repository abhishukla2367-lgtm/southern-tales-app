import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axiosConfig";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orderType, setOrderType] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load cart from MongoDB on mount (only if user is logged in)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchCart();
    }
  }, []);

  // Fetch cart from MongoDB
  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/cart");
      setCartItems(data.items || []);
    } catch (error) {
      console.error("Failed to fetch cart:", error.message);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Add item to MongoDB cart
  const addToCart = async (newItem) => {
    try {
      const { data } = await API.post("/cart/add", {
        productId: newItem._id,
        name: newItem.name,
        price: newItem.price,
        quantity: 1,
        image: newItem.image,
      });
      setCartItems(data.items || []);
    } catch (error) {
      console.error("Failed to add to cart:", error.message);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  // Update quantity
  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return removeFromCart(id);
    try {
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId === id || item._id === id
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error("Failed to update quantity:", error.message);
    }
  };

  // Remove item from MongoDB cart
  const removeFromCart = async (id) => {
    const previousItems = cartItems;
    // Optimistically remove from UI immediately
    setCartItems((prev) =>
      prev.filter((item) => item.productId !== id && item._id !== id)
    );
    try {
      const { data } = await API.delete(`/cart/item/${id}`);
      setCartItems(data.items || []);
    } catch (error) {
      console.error("Failed to remove item:", error.message);
      setCartItems(previousItems); // Revert on failure
      alert("Failed to remove item. Please try again.");
    }
  };

  // Clear entire cart from MongoDB
  const clearCart = async () => {
    try {
      await API.delete("/cart/clear");
      setCartItems([]);
      setOrderType("");
    } catch (error) {
      console.error("Failed to clear cart:", error.message);
      setCartItems([]);
      setOrderType("");
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0
    );
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
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
        isPlacingOrder,
        loading,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);