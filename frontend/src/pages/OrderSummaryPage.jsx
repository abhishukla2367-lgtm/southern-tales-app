import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import LiveTrackingMap from "../components/LiveTrackingMap";
import { FaMapMarkerAlt, FaClock, FaCreditCard, FaChevronLeft, FaPhoneAlt, FaCheckCircle } from "react-icons/fa";
import API from "../api/axiosConfig"; // ✅ FIX: replaced hardcoded fetch with configured API instance

const OrderSummaryPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  
  const [address, setAddress] = useState(state?.details?.address || "");
  const [phone, setPhone] = useState(state?.details?.phone || "");
  const [time, setTime] = useState(state?.details?.time || "");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const trackingRef = useRef(null);
  const isDelivery = state?.details?.type === "delivery";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const totalAmount = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);

  const handleConfirmOrder = async () => {
    if (isDelivery && !address) return alert("Please enter your delivery address!");
    if (!phone || !time || !paymentMethod) return alert("Please fill in all details!");

    const orderData = {
      items: cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: totalAmount,
      deliveryInfo: {
        address: isDelivery ? address : "Sector 15, CBD Belapur",
        phone: phone
      }
    };

    try {
      // ✅ FIX: use API instance — handles baseURL, auth headers, and interceptors automatically
      const response = await API.post("/orders", orderData);
      const result = response.data;

      clearCart();
      setOrderConfirmed(true);
      alert("Order Placed Successfully!");
      navigate("/");
    } catch (err) {
      console.error("Order Error:", err);
      const msg = err.response?.data?.error || err.response?.data?.message || "Something went wrong";
      alert(`Order Failed: ${msg}`);
    }
  };



  return (
    <div 
      className="min-h-screen relative flex flex-col items-center p-6 pt-28 bg-fixed bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1470&q=80')" }}
    >
      <div className="absolute inset-0 bg-black/70 z-0"></div>

      <div className="relative z-10 w-full max-w-2xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-6">
          <FaChevronLeft /> Back to Cart
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-white">Order Summary</h1>
          <div className="flex items-center gap-3 mt-2">
             <span className="px-3 py-1 bg-yellow-400 text-black text-xs font-bold rounded-full uppercase">
               {state?.details?.type || "Order"}
             </span>
             <p className="text-gray-300 italic">Finalize your {state?.details?.type} details</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* 1. ITEMS LIST */}
          <div className="bg-black/80 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Your Selections</h3>
            <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b border-gray-800 pb-4">
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-gray-700" />
                    <div>
                      <h2 className="font-semibold text-gray-100">{item.name}</h2>
                      <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-100">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. DYNAMIC FORM FIELDS */}
          <div className="bg-black/80 backdrop-blur-md border border-gray-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
                  <FaMapMarkerAlt /> {isDelivery ? "Delivery Address" : "Pickup From Store"}
                </label>
                {isDelivery ? (
                  <input type="text" placeholder="Enter location" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-white transition" />
                ) : (
                  <div className="w-full bg-gray-900/50 border border-dashed border-gray-700 p-3 rounded-xl text-yellow-500 text-sm">
                    Sector 15, CBD Belapur,Navi Mumbai, Maharashtra 400614
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase"><FaPhoneAlt /> Phone Number</label>
                <input type="text" placeholder="Enter mobile" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-white transition" />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase"><FaClock /> Preferred Time</label>
                <input type="text" placeholder="e.g. 40-50 minuntes" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-white transition" />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase"><FaCreditCard /> Payment</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none text-white transition">
                  <option value="">Select Method</option>
                  <option value="UPI">UPI/GPay/Paypal</option>
                  <option value="Credit">Credit Card</option>
                  <option value="COD">{isDelivery ? "Cash on Delivery" : "Pay at Store"}</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. TOTAL & ACTIONS */}
          <div className="bg-black/90 backdrop-blur-lg border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-lg">Payable Amount</span>
              <span className="text-3xl font-black text-yellow-500">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex gap-4">
              <button onClick={() => { clearCart(); navigate("/"); }} className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all">Cancel</button>
              <button onClick={handleConfirmOrder} className="flex-1 py-4 bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl font-black transition-all">Confirm Order</button>
            </div>
          </div>

          {/* LIVE TRACKING (DELIVERY ONLY) */}
          {orderConfirmed && isDelivery && (
            <div ref={trackingRef} className="w-full bg-black/90 border-2 border-yellow-500 rounded-2xl p-6 mt-10 animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="h-3 w-3 bg-yellow-400 rounded-full animate-ping"></span> Live Tracking
              </h2>
              <div className="rounded-xl overflow-hidden border border-gray-800">
                <LiveTrackingMap />
              </div>
            </div>
          )}

          {/* PICKUP SUCCESS MESSAGE (PICKUP ONLY) */}
          {orderConfirmed && !isDelivery && (
            <div ref={trackingRef} className="w-full bg-black/90 border-2 border-green-500 rounded-2xl p-8 mt-10 text-center animate-fade-in">
              <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h2>
              <p className="text-gray-400">Please arrive at the store in <span className="text-yellow-400 font-bold">{time}</span>.</p>
              <p className="text-xs text-gray-500 mt-2">Order ID: #EAT-{Math.floor(1000 + Math.random() * 9000)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryPage;