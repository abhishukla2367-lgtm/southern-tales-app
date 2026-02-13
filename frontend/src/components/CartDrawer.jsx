import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext"; // Required for Auth Check
import emptyCartImage from "../assets/images/empty-cart.jpg";
import eatsureLogo from "../assets/images/eat-sure-logo.png";

const CartDrawer = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Task #4: Auth Check
  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
    totalPrice,
    orderType,
    setOrderType,
  } = useCart();

  const [platform, setPlatform] = useState("");
  const [address, setAddress] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Task #8: Handle Order Placement & MongoDB Integration
  const handlePlaceOrder = async () => {
    if (!user) {
      alert("Please login to place an order.");
      return navigate("/login");
    }

    if (orderType === "delivery" && (!platform || !address)) {
      return alert("Please select a platform and enter your delivery address.");
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id, // Linking order to specific user
          items: cartItems,
          total: totalPrice,
          orderType,
          platform: orderType === "delivery" ? platform : "N/A",
          address: orderType === "delivery" ? address : "Pickup",
          time,
          status: "Pending", // For Admin Panel Task
          createdAt: new Date(),
        }),
      });

      if (response.ok) {
        alert("Order placed successfully!");
        clearCart(); // Task #8: Remove items from cart on success
        navigate("/my-orders"); // Task #6: Show My Orders
      } else {
        throw new Error("Failed to place order");
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deliveryPlatforms = [
    { name: "Zomato", logo: "https://upload.wikimedia.org" },
    { name: "Swiggy", logo: "https://upload.wikimedia.org" },
    { name: "Dominos", logo: "https://upload.wikimedia.org" },
    { name: "EatSure", logo: eatsureLogo },
  ];

  return (
    <div className="min-h-screen pt-28 bg-gray-50 flex flex-col items-center px-4">
      <h1 className="text-4xl font-extrabold text-orange-600 mb-2">Your Cart</h1>
      <p className="text-gray-600 mb-10 text-lg text-center">Review Your Delicious Selections</p>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center gap-6 mt-20">
          <img src={emptyCartImage} alt="Empty" className="w-40 h-40" />
          <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
          <button onClick={() => navigate("/menu")} className="bg-yellow-400 px-6 py-3 rounded-md font-medium">Browse Menu</button>
        </div>
      ) : (
        <div className="w-full max-w-3xl flex flex-col gap-6 mb-20">
          {/* Item List */}
          {cartItems.map((item) => (
            <div key={item.name} className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-orange-500 font-bold">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => decreaseQty(item.name)} className="bg-gray-200 px-2 rounded">-</button>
                <span className="px-2">{item.quantity}</span>
                <button onClick={() => increaseQty(item.name)} className="bg-gray-200 px-2 rounded">+</button>
                <button onClick={() => removeFromCart(item.name)} className="bg-red-500 text-white px-2 rounded ml-2">Remove</button>
              </div>
            </div>
          ))}

          {/* Order Details Panel */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold text-gray-700 mb-4">Delivery Options</h3>
            <div className="flex gap-4 mb-6">
              <button onClick={() => setOrderType("delivery")} className={`flex-1 py-2 rounded-lg font-semibold ${orderType === "delivery" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"}`}>Delivery</button>
              <button onClick={() => setOrderType("pickup")} className={`flex-1 py-2 rounded-lg font-semibold ${orderType === "pickup" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"}`}>Pickup</button>
            </div>

            {orderType === "delivery" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {deliveryPlatforms.map((p) => (
                    <button key={p.name} onClick={() => setPlatform(p.name)} className={`flex items-center gap-2 p-2 border rounded-lg ${platform === p.name ? "border-orange-500 bg-orange-50" : "border-gray-200"}`}>
                      <img src={p.logo} alt={p.name} className="w-6 h-6" /> <span className="text-sm">{p.name}</span>
                    </button>
                  ))}
                </div>
                <input type="text" placeholder="Full Delivery Address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none" />
              </div>
            )}
            <input type="text" placeholder="Preferred Time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full p-3 mt-4 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none" />
          </div>

          {/* Final Summary */}
          <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-lg">
            <span className="text-xl font-bold">Total: {formatCurrency(totalPrice)}</span>
            <div className="flex gap-3">
              <button onClick={clearCart} className="text-red-500 underline font-semibold">Clear Cart</button>
              <button 
                onClick={handlePlaceOrder} 
                disabled={loading}
                className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold shadow-md hover:bg-orange-700 transition"
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartDrawer;
