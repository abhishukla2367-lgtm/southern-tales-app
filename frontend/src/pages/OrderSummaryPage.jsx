import React, { useState, useEffect, useRef, useContext } from "react";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext"; // Requirement #4
import LiveTrackingMap from "../components/LiveTrackingMap";

const OrderSummaryPage = () => {
  const { cartItems, orderType, setOrderType, clearCart } = useCart();
  const { user } = useContext(AuthContext); // Linking order to logged-in user
  
  const [address, setAddress] = useState("");
  const [time, setTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const trackingRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  // Task #8: Store Order in Database & Clear Cart
  const handleConfirmOrder = async () => {
    if (!user) return alert("Please login to place an order.");
    if (orderType === "delivery" && !address) return alert("Please enter delivery address!");
    if (!time || !paymentMethod) return alert("Please fill in all details!");

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          items: cartItems,
          total: totalAmount,
          orderType,
          address: orderType === "delivery" ? address : "Self-Pickup",
          time,
          paymentMethod,
          status: "Confirmed", // For Admin Panel Task
          createdAt: new Date()
        }),
      });

      if (response.ok) {
        setOrderConfirmed(true);
        clearCart(); // Requirement #8: Remove items from cart on success
        
        // Only scroll if it's a delivery order (since map only shows for delivery)
        if (orderType === "delivery") {
          setTimeout(() => {
            trackingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 300);
        } else {
          alert("Pickup Order Confirmed! Please arrive at the selected time.");
        }
      }
    } catch (err) {
      alert("Error connecting to MongoDB: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6 pt-28 bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com')" }}
    >
      <div className="w-full max-w-xl bg-white/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b">
          <h1 className="text-3xl font-bold text-orange-600">Order Summary</h1>
          <p className="text-gray-700">Finalize your {orderType} details</p>
        </div>

        {/* CART ITEMS LIST */}
        <div className="p-6 space-y-4 max-h-[300px] overflow-y-auto border-b">
          {cartItems.length === 0 && !orderConfirmed ? (
            <p className="text-center text-gray-400">No items in summary</p>
          ) : (
            cartItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <h2 className="font-semibold text-sm">{item.name}</h2>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-gray-800">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))
          )}
        </div>

        {/* ORDER DETAILS FORM */}
        <div className="p-6 space-y-4">
          <div className="flex gap-4">
            <button onClick={() => setOrderType("delivery")} className={`flex-1 py-2 rounded-lg font-bold ${orderType === "delivery" ? "bg-orange-500 text-white" : "bg-gray-200"}`}>Delivery</button>
            <button onClick={() => setOrderType("pickup")} className={`flex-1 py-2 rounded-lg font-bold ${orderType === "pickup" ? "bg-orange-500 text-white" : "bg-gray-200"}`}>Pickup</button>
          </div>

          {orderType === "delivery" && (
            <input type="text" placeholder="Delivery Address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none" />
          )}

          <input type="text" placeholder={orderType === "delivery" ? "Delivery Time" : "Pickup Time"} value={time} onChange={(e) => setTime(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none" />
          
          <input type="text" placeholder="Payment Method (e.g. UPI, Card)" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none" />

          <div className="flex justify-between text-xl font-bold pt-4 border-t">
            <span>Total:</span>
            <span className="text-orange-600">{formatCurrency(totalAmount)}</span>
          </div>

          <button 
            onClick={handleConfirmOrder} 
            disabled={loading || cartItems.length === 0}
            className={`w-full py-3 rounded-xl font-bold text-white transition ${loading ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"}`}
          >
            {loading ? "Processing..." : "Confirm Order"}
          </button>
        </div>
      </div>

      {/* ✅ CONDITIONAL RENDERING: Map only shows for Delivery + Confirmed */}
      {orderConfirmed && orderType === "delivery" && (
        <div ref={trackingRef} className="w-full max-w-4xl mt-10 bg-white rounded-2xl shadow-2xl p-8 border-4 border-orange-100 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Live Order Tracking</h2>
          </div>
          <div className="rounded-xl overflow-hidden border">
            <LiveTrackingMap />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummaryPage;
