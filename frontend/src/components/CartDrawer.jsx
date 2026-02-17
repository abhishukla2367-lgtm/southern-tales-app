import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import emptyCartImage from "../assets/images/empty-cart.jpg";
import eatsureLogo from "../assets/images/eat-sure-logo.png";

const CartDrawer = () => {
  const navigate = useNavigate();

  // Logic from your professional Context
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    orderType,
    setOrderType,
    placeOrder,
    isPlacingOrder,
  } = useCart();

  // Local state for all your original fields
  const [platform, setPlatform] = useState("");
  const [userAddressState, setUserAddressState] = useState("");
  const [userPhoneState, setUserPhoneState] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  const totalPrice = getCartTotal();

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Original Delivery Platforms
  const deliveryPlatforms = [
    { name: "Zomato", logo: "https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png" },
    { name: "Swiggy", logo: "https://upload.wikimedia.org/wikipedia/commons/1/13/Swiggy_logo.png" },
    { name: "Dominos", logo: "https://upload.wikimedia.org/wikipedia/commons/7/74/Dominos_pizza_logo.svg" },
    { name: "EatSure", logo: eatsureLogo },
  ];

  // Logic to handle order placement using Context + Local Fields
  const handlePlaceOrder = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login to place an order");
      return navigate("/login");
    }
    const deliveryDetails = {
    address: orderType === "delivery" ? `${platform} - ${userAddressState}` : "Pickup",
    phone: userPhoneState, // Ensure this state is being updated by an input!
    time: preferredTime || "ASAP"
  };
    
    
    // Task 4: Login Check
    

    // Call the professional placeOrder logic from Context
    await placeOrder(user, deliveryDetails);
  };

  return (
    <div className="min-h-screen pt-28 bg-[#0a0a0a] text-white flex flex-col items-center px-4">
      <h1 className="text-4xl font-extrabold text-orange-600 mb-2 text-center">
        Your Cart
      </h1>
      <p className="text-gray-400 mb-10 text-center text-lg">
        Review Your Delicious Selections
      </p>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center gap-6 mt-20">
          <img src={emptyCartImage} alt="Empty Cart" className="w-40 h-40 grayscale" />
          <h2 className="text-xl font-semibold text-gray-300">Your cart is empty</h2>
          <button
            onClick={() => navigate("/menu")}
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-3 rounded-md mt-4"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="w-full max-w-3xl flex flex-col gap-6 mb-20">
          
          {/* CART ITEMS */}
          {cartItems.map((item,index) => (
            <div key={item._id || item.id || index} className="bg-[#141414] border border-gray-800 rounded-xl shadow p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg border border-gray-700" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-100">{item.name}</h3>
                  <p className="text-orange-500 font-bold">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="bg-gray-800 px-2 rounded hover:bg-gray-700 text-white"
                >
                  -
                </button>
                <span className="px-2">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="bg-gray-800 px-2 rounded hover:bg-gray-700 text-white"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 ml-2 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* ORDER TYPE SELECTION */}
          <div className="bg-[#141414] border border-gray-800 rounded-xl shadow p-4">
            <h3 className="font-semibold text-gray-300 mb-3 uppercase text-sm tracking-widest">Order Type</h3>
            <div className="flex gap-4">
              <button
                onClick={() => setOrderType("delivery")}
                className={`flex-1 py-2 rounded-lg font-semibold transition ${
                  orderType === "delivery" ? "bg-orange-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Delivery
              </button>
              <button
                onClick={() => setOrderType("pickup")}
                className={`flex-1 py-2 rounded-lg font-semibold transition ${
                  orderType === "pickup" ? "bg-orange-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Pickup
              </button>
            </div>

            {/* ALL ORIGINAL DELIVERY FIELDS */}
            {/* ALL ORIGINAL DELIVERY FIELDS */}
{orderType === "delivery" && (
  <div className="mt-6 space-y-5"> {/* Added space-y for consistent padding */}
    <h4 className="font-semibold text-gray-300 mb-4">Choose Delivery Partner</h4>
    <div className="grid grid-cols-2 gap-4">
      {deliveryPlatforms.map((p) => (
        <button
          key={p.name}
          onClick={() => setPlatform(p.name)}
          className={`flex items-center gap-3 px-4 py-2 rounded-xl border font-semibold transition-all ${
            platform === p.name ? "bg-orange-900/30 border-orange-500 text-white shadow-lg" : "bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-800"
          }`}
        >
          <img src={p.logo} alt={p.name} className="w-6 h-6 object-contain" />
          <span>{p.name}</span>
        </button>
      ))}
    </div>

    <div className="mt-5 space-y-3">
      <input 
        type="text" 
        placeholder="Enter delivery address" 
        value={userAddressState} 
        onChange={(e) => setUserAddressState(e.target.value)} 
        className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none text-white"
      />

      <input
        type="text"
        placeholder="Preferred delivery time"
        value={preferredTime}
        onChange={(e) => setPreferredTime(e.target.value)}
        className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none text-white"
      />

      <input 
        type="text" 
        placeholder="Enter phone number" 
        value={userPhoneState}
        onChange={(e) => setUserPhoneState(e.target.value)}
        className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none text-white"
      />
    </div>

    {/* PAYMENT METHOD - Now inside the delivery block */}
    <div className="mt-4">
      <h4 className="font-semibold text-gray-300 mb-2">Payment Method</h4>
      <select className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-orange-400">
        <option value="cod">Cash on Delivery</option>
        <option value="online">Online Payment</option>
      </select>
    </div>
  </div> 
)}


            {/* PICKUP FIELDS */}
            {orderType === "pickup" && (
              <div className="mt-5">
                <input
                  type="text"
                  placeholder="Preferred pickup time"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none text-white"
                />
              </div>
            )}
          </div>

          {/* TOTAL & ACTION BUTTONS */}
          <div className="flex justify-between items-center px-2">
            <span className="text-xl font-semibold text-gray-300">Total:</span>
            <span className="text-2xl font-bold text-orange-500">
              {formatCurrency(totalPrice)}
            </span>
          </div>

          <div className="flex gap-4">
            <button
              onClick={clearCart}
              className="bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white font-semibold px-6 py-3 rounded-md flex-1 transition"
            >
              Clear Cart
            </button>
            <button
  onClick={handlePlaceOrder}
  disabled={isPlacingOrder}
  className={`font-bold px-6 py-3 rounded-md flex-1 transition-all duration-300 shadow-lg ${
    isPlacingOrder 
      ? "bg-gray-700 text-gray-500 cursor-not-allowed" 
      : "bg-yellow-400 hover:bg-yellow-500 text-black active:scale-95"
  }`}
>
  {isPlacingOrder ? "Processing..." : "Proceed to Checkout"}
</button>

          </div>
        </div>
      )}
    </div>
  );
};

export default CartDrawer;
