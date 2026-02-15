import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import LiveTrackingMap from "../components/LiveTrackingMap";

const OrderSummaryPage = () => {
  const { cartItems, orderType, setOrderType } = useCart();
  const [address, setAddress] = useState("");
  const [time, setTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState(false);

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

  const handleConfirmOrder = () => {
    if (orderType === "delivery" && !address) {
      alert("Please enter your delivery address!");
      return;
    }
    if (!time || !paymentMethod) {
      alert("Please fill in all details!");
      return;
    }

    alert(`Order Confirmed!
Order Type: ${orderType}
${orderType === "delivery" ? "Address: " + address + "\n" : ""}
Time: ${time}
Payment: ${paymentMethod}`);

    setOrderConfirmed(true);

    // ✅ AUTO SCROLL TO LIVE TRACKING
    setTimeout(() => {
      trackingRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 200);
  };

  return (
    <div
      className="min-h-screen flex justify-center p-6 pt-28 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1470&q=80')",
      }}
    >
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white/90 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-3xl font-bold text-orange-600">Order Summary</h1>
          <p className="text-gray-700 mt-1">Review your selections</p>
        </div>

        <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[400px]">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-400">Your cart is empty</p>
          ) : (
            cartItems.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center border-b pb-2"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover transition-transform duration-200 hover:scale-110"
                  />
                  <div>
                    <h2 className="font-semibold text-gray-800">{item.name}</h2>
                    <p className="text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-800">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-b space-y-2">
          <h3 className="font-semibold text-gray-700">Order Type</h3>
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => setOrderType("delivery")}
              className={`flex-1 py-2 rounded-lg font-semibold ${
                orderType === "delivery"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Delivery
            </button>
            <button
              onClick={() => setOrderType("pickup")}
              className={`flex-1 py-2 rounded-lg font-semibold ${
                orderType === "pickup"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Pickup
            </button>
          </div>
        </div>

        {orderType === "delivery" && (
          <div className="p-6 border-b space-y-3">
            <h3 className="font-semibold text-gray-700">Delivery Details</h3>
            <input
              type="text"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <input
              type="text"
              placeholder="Preferred delivery time (e.g., 30-45 min)"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        )}

        {orderType === "pickup" && (
          <div className="p-6 border-b space-y-3">
            <h3 className="font-semibold text-gray-700">Pickup Details</h3>
            <input
              type="text"
              placeholder="Preferred pickup time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        )}

        <div className="p-6 border-b space-y-3">
          <h3 className="font-semibold text-gray-700">Payment Method</h3>
          <input
            type="text"
            placeholder="Enter payment method (e.g., Visa ****1234)"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 flex flex-col gap-4">
            <div className="flex justify-between text-lg font-semibold text-gray-800">
              <span>Total</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
            <button
              onClick={handleConfirmOrder}
              className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
            >
              Confirm Order
            </button>
          </div>
        )}

        <div className="h-6" />
      </div>

      {orderConfirmed && (
        <div
          ref={trackingRef}
          className="w-full max-w-4xl mt-10 bg-white rounded-2xl shadow-xl p-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Live Delivery Tracking
          </h2>
          <LiveTrackingMap />
        </div>
      )}
    </div>
  );
};

export default OrderSummaryPage;
