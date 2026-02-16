import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import emptyCartImage from "../assets/images/empty-cart.jpg";
import eatsureLogo from "../assets/images/eat-sure-logo.png";

const CartDrawer = () => {
  const navigate = useNavigate();

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

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const deliveryPlatforms = [
    {
      name: "Zomato",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png",
    },
    {
      name: "Swiggy",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/13/Swiggy_logo.png",
    },
    {
      name: "Dominos",
      logo: "https://upload.wikimedia.org/wikipedia/commons/7/74/Dominos_pizza_logo.svg",
    },
    {
      name: "EatSure",
      logo: eatsureLogo,
    },
  ];

  return (
    <div className="min-h-screen pt-28 bg-gray-50 flex flex-col items-center px-4">
      <h1 className="text-4xl font-extrabold text-orange-600 mb-2 text-center">
        Your Cart
      </h1>
      <p className="text-gray-600 mb-10 text-center text-lg">
        Review Your Delicious Selections
      </p>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center gap-6 mt-20">
          <img src={emptyCartImage} alt="Empty Cart" className="w-40 h-40" />
          <h2 className="text-xl font-semibold text-gray-700">
            Your cart is empty
          </h2>
          <p className="text-gray-500 text-center max-w-sm">
            Add some South Indian dishes to get started
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-6 py-3 rounded-md mt-4"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="w-full max-w-3xl flex flex-col gap-6 mb-20">
          {/* CART ITEMS */}
          {cartItems.map((item) => (
            <div
              key={item.name}
              className="bg-white rounded-xl shadow p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-orange-500 font-bold">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => decreaseQty(item.name)}
                  className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                >
                  -
                </button>
                <span className="px-2">{item.quantity}</span>
                <button
                  onClick={() => increaseQty(item.name)}
                  className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.name)}
                  className="bg-red-500 text-white px-2 rounded hover:bg-red-600 ml-2"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* ORDER TYPE */}
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold text-gray-700 mb-3">Order Type</h3>

            <div className="flex gap-4">
              <button
                onClick={() => setOrderType("delivery")}
                className={`flex-1 py-2 rounded-lg font-semibold transition ${
                  orderType === "delivery"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Delivery
              </button>
              <button
                onClick={() => setOrderType("pickup")}
                className={`flex-1 py-2 rounded-lg font-semibold transition ${
                  orderType === "pickup"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Pickup
              </button>
            </div>

            {/* DELIVERY OPTIONS */}
            {orderType === "delivery" && (
              <>
                {/* PLATFORM SELECTION */}
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-700 mb-4">
                    Choose Delivery Partner
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    {deliveryPlatforms.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => setPlatform(p.name)}
                        className={`flex items-center gap-3 px-4 py-2 rounded-xl border font-semibold
                          transition-all duration-200
                          ${
                            platform === p.name
                              ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500 shadow-md scale-[1.02]"
                              : "bg-gray-50 text-gray-800 border-gray-200 hover:bg-white hover:shadow-sm hover:scale-[1.01]"
                          }
                        `}
                      >
                        <img
                          src={p.logo}
                          alt={p.name}
                          className="w-6 h-6 object-contain"
                        />
                        <span>{p.name}</span>
                      </button>
                    ))}
                  </div>

                  {platform && (
                    <p className="mt-3 text-sm text-green-600 font-semibold">
                      Selected Delivery Partner: {platform}
                    </p>
                  )}
                </div>

                {/* DELIVERY DETAILS */}
                <div className="mt-5 space-y-3">
                  <input
                    type="text"
                    placeholder="Enter delivery address"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <input
                    type="text"
                    placeholder="Preferred delivery time"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </>
            )}

            {/* PICKUP DETAILS */}
            {orderType === "pickup" && (
              <div className="mt-5 space-y-3">
                <input
                  type="text"
                  placeholder="Preferred pickup time"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            )}
          </div>

          {/* TOTAL */}
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold">Total:</span>
            <span className="text-xl font-bold text-orange-500">
              {formatCurrency(totalPrice)}
            </span>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4">
            <button
              onClick={clearCart}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-md flex-1"
            >
              Clear Cart
            </button>

            <button
              disabled={orderType === "delivery" && !platform}
              onClick={() => navigate("/order-summary")}
              className={`font-semibold px-6 py-3 rounded-md flex-1 transition ${
                orderType === "delivery" && !platform
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-yellow-400 hover:bg-yellow-500 text-black"
              }`}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartDrawer;