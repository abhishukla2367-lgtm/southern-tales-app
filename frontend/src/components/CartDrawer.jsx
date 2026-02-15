import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import emptyCartImage from "../assets/images/empty-cart.jpg";
import eatsureLogo from "../assets/images/eat-sure-logo.png";
import { Trash2, ShoppingBag, ArrowLeft, Truck, Package } from "lucide-react";

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
            maximumFractionDigits: 0,
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
        <div className="min-h-screen pt-28 bg-black text-white flex flex-col items-center px-4">
            {/* Header Section */}
            <div className="text-center mb-10">
                <h1 className="text-4xl font-black uppercase tracking-tighter text-white mb-2">
                    Your <span className="text-orange-500">Cart</span>
                </h1>
                <div className="h-1 w-20 bg-orange-500 mx-auto rounded-full mb-4"></div>
                <p className="text-zinc-400 font-medium italic">
                    Review your premium selections
                </p>
            </div>

            {cartItems.length === 0 ? (
                <div className="flex flex-col items-center gap-6 mt-16 animate-in fade-in zoom-in duration-500">
                    <div className="relative">
                        <img src={emptyCartImage} alt="Empty Cart" className="w-48 h-48 opacity-20 grayscale" />
                        <ShoppingBag className="absolute inset-0 m-auto text-orange-500 w-12 h-12 opacity-80" />
                    </div>
                    <h2 className="text-2xl font-bold text-zinc-200">Your kitchen is quiet</h2>
                    <p className="text-zinc-500 text-center max-w-xs leading-relaxed">
                        It seems you haven't added any South Indian delicacies to your order yet.
                    </p>
                    <button
                        onClick={() => navigate("/menu")}
                        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-orange-500/20"
                    >
                        <ArrowLeft size={18} />
                        Browse Menu
                    </button>
                </div>
            ) : (
                <div className="w-full max-w-3xl flex flex-col gap-8 mb-24">

                    {/* CART ITEMS LIST */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500 ml-2">Items</h3>
                        {cartItems.map((item) => (
                            <div
                                key={item.name}
                                className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-white/5 p-5 flex items-center justify-between group hover:border-orange-500/30 transition-all duration-300"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="relative overflow-hidden rounded-xl h-20 w-20 border border-white/10">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white group-hover:text-orange-500 transition-colors">{item.name}</h3>
                                        <p className="text-orange-500 font-black text-xl">
                                            {formatCurrency(item.price * item.quantity)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 bg-black/40 p-2 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3 bg-zinc-800 rounded-lg px-2 py-1">
                                        <button
                                            onClick={() => decreaseQty(item.name)}
                                            className="text-zinc-400 hover:text-white transition-colors font-bold text-xl px-2"
                                        >
                                            −
                                        </button>
                                        <span className="font-bold text-white min-w-[20px] text-center">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => increaseQty(item.name)}
                                            className="text-zinc-400 hover:text-white transition-colors font-bold text-xl px-2"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.name)}
                                        className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ORDER TYPE SELECTION */}
                    <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-6 shadow-xl">
                        <div className="flex items-center gap-2 mb-4">
                            <Package size={20} className="text-orange-500" />
                            <h3 className="font-bold text-white uppercase tracking-wider">Service Mode</h3>
                        </div>

                        <div className="flex gap-4 p-1 bg-black rounded-xl border border-white/5">
                            <button
                                onClick={() => setOrderType("delivery")}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${orderType === "delivery"
                                        ? "bg-orange-500 text-white shadow-lg"
                                        : "text-zinc-500 hover:text-zinc-300"
                                    }`}
                            >
                                <Truck size={18} />
                                Delivery
                            </button>
                            <button
                                onClick={() => setOrderType("pickup")}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${orderType === "pickup"
                                        ? "bg-orange-500 text-white shadow-lg"
                                        : "text-zinc-500 hover:text-zinc-300"
                                    }`}
                            >
                                <Package size={18} />
                                Self-Pickup
                            </button>
                        </div>

                        {/* DELIVERY CONTENT */}
                        {orderType === "delivery" && (
                            <div className="animate-in slide-in-from-top-2 duration-300">
                                <div className="mt-8">
                                    <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">
                                        Preferred Delivery Partner
                                    </h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {deliveryPlatforms.map((p) => (
                                            <button
                                                key={p.name}
                                                onClick={() => setPlatform(p.name)}
                                                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-300
                          ${platform === p.name
                                                        ? "bg-orange-500/10 border-orange-500 ring-1 ring-orange-500 shadow-orange-500/20 shadow-lg scale-[1.05]"
                                                        : "bg-black border-white/5 hover:border-white/20"
                                                    }
                        `}
                                            >
                                                <img src={p.logo} alt={p.name} className="w-8 h-8 object-contain" />
                                                <span className="text-[10px] font-bold uppercase tracking-tighter">{p.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6 space-y-4">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Shipping Address"
                                            className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-zinc-600"
                                        />
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Preferred Delivery Time (e.g. As soon as possible)"
                                            className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-zinc-600"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PICKUP CONTENT */}
                        {orderType === "pickup" && (
                            <div className="mt-6 animate-in slide-in-from-top-2 duration-300">
                                <input
                                    type="text"
                                    placeholder="When will you arrive?"
                                    className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-zinc-600"
                                />
                                <p className="mt-3 text-xs text-zinc-500 italic px-2">
                                    *Our chefs will have your order ready 5 minutes before your arrival.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* SUMMARY & CHECKOUT */}
                    <div className="bg-zinc-900 rounded-2xl p-8 border border-white/10 shadow-2xl">
                        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                            <span className="text-zinc-400 font-bold uppercase tracking-widest">Total Payable</span>
                            <span className="text-4xl font-black text-white">
                                {formatCurrency(totalPrice)}
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={clearCart}
                                className="flex items-center justify-center gap-2 bg-transparent border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white font-bold px-8 py-4 rounded-xl flex-1 transition-all duration-300"
                            >
                                <Trash2 size={18} />
                                Clear All
                            </button>

                            <button
                                disabled={orderType === "delivery" && !platform}
                                onClick={() => navigate("/order-summary")}
                                className={`font-black uppercase tracking-[0.2em] px-8 py-4 rounded-xl flex-1 transition-all transform active:scale-95 shadow-xl ${orderType === "delivery" && !platform
                                        ? "bg-zinc-800 text-zinc-600 cursor-not-allowed grayscale"
                                        : "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/30"
                                    }`}
                            >
                                Proceed to Secure Checkout
                            </button>
                        </div>

                        {orderType === "delivery" && !platform && (
                            <p className="text-center text-xs text-orange-500/70 mt-4 animate-pulse">
                                Please select a delivery partner to continue
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartDrawer;