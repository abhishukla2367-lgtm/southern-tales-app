import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import emptyCartImage from "../assets/images/empty-cart.jpg";
import eatsureLogo from "../assets/images/eat-sure-logo.png";
import { Trash2, ShoppingBag, ArrowLeft, Truck, Package, CreditCard } from "lucide-react";

const CartDrawer = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  // Updated to match your final CartContext.jsx function names
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    orderType,
    setOrderType,
    placeOrder,
    isPlacingOrder
  } = useCart();

  const totalPrice = getCartTotal();
  const [platform, setPlatform] = useState("");

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const deliveryPlatforms = [
    { name: "Zomato", logo: "https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png" },
    { name: "Swiggy", logo: "https://upload.wikimedia.org/wikipedia/commons/1/13/Swiggy_logo.png" },
    { name: "Dominos", logo: "https://upload.wikimedia.org/wikipedia/commons/7/74/Dominos_pizza_logo.svg" },
    { name: "EatSure", logo: eatsureLogo },
  ];

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      alert("Please login to place an order.");
      navigate("/login");
      return;
    }
    const result = await placeOrder(user);
    if (result.success) navigate("/profile");
  };

  return (
    // FIX: Forced bg-black and text-white for Professional Theme
    <div className="min-h-screen pt-32 bg-black text-white flex flex-col items-center px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-2">
          Your <span className="text-orange-500">Cart</span>
        </h1>
        <div className="h-1 w-20 bg-orange-500 mx-auto rounded-full mb-4"></div>
        <p className="text-zinc-400 font-medium italic">Review Your Delicious Selections</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center gap-6 mt-16 animate-in fade-in zoom-in duration-500">
          <div className="relative">
            <img src={emptyCartImage} alt="Empty Cart" className="w-48 h-48 opacity-20 grayscale" />
            <ShoppingBag className="absolute inset-0 m-auto text-orange-500 w-12 h-12 opacity-80" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-200">Your cart is empty</h2>
          <p className="text-zinc-500 text-center max-w-sm">Add some South Indian dishes to get started</p>
          <button
            onClick={() => navigate("/menu")}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-10 py-4 rounded-xl mt-4 transition-all shadow-lg shadow-orange-500/20"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="w-full max-w-3xl flex flex-col gap-8 mb-24">
          {/* ITEMS LIST */}
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-white/5 p-5 flex items-center justify-between group">
                <div className="flex items-center gap-5">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl border border-white/10" />
                  <div>
                    <h3 className="font-bold text-lg text-white">{item.name}</h3>
                    <p className="text-orange-500 font-black text-xl">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-black/40 p-2 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3 bg-zinc-800 rounded-lg px-2 py-1">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="text-zinc-400 hover:text-white font-bold text-xl px-2">−</button>
                    <span className="font-bold text-white min-w-[20px] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="text-zinc-400 hover:text-white font-bold text-xl px-2">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item._id)} className="p-2 text-zinc-500 hover:text-red-500"><Trash2 size={20} /></button>
                </div>
              </div>
            ))}
          </div>

          {/* SERVICE MODE (Task 8.2) */}
          <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-6">
            <h3 className="font-bold text-white uppercase tracking-wider mb-4">Service Mode</h3>
            <div className="flex gap-4 p-1 bg-black rounded-xl border border-white/5">
              <button onClick={() => setOrderType("delivery")} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${orderType === "delivery" ? "bg-orange-500 text-white" : "text-zinc-500"}`}><Truck size={18} /> Delivery</button>
              <button onClick={() => setOrderType("pickup")} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${orderType === "pickup" ? "bg-orange-500 text-white" : "text-zinc-500"}`}><Package size={18} /> Pickup</button>
            </div>
          </div>

          {/* FINAL SUMMARY & CHECKOUT (Task 8.3) */}
          <div className="bg-zinc-900/80 rounded-3xl border border-white/10 p-8 shadow-2xl">
            <div className="flex justify-between items-end mb-8">
              <div>
                <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-1">Total Payable</p>
                <h2 className="text-4xl font-black text-white">{formatCurrency(totalPrice)}</h2>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isPlacingOrder}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-5 rounded-2xl text-xl transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isPlacingOrder ? "PROCESSING..." : <><CreditCard size={24} /> PLACE ORDER</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartDrawer;
