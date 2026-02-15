import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
import { CartContext } from "../context/CartContext";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useContext(CartContext);
  const navigate = useNavigate();

  const total = getCartTotal();

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 border-b border-white/10 pb-6">
          <h1 className="text-4xl font-black tracking-tight">Your <span className="text-orange-500">Cart</span></h1>
          <Link to="/menu" className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors">
            <ArrowLeft size={20} /> Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-20 bg-[#111111] rounded-3xl border border-white/5">
            <ShoppingBag size={80} className="mx-auto text-gray-700 mb-6" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added any Southern flavors yet.</p>
            <button 
              onClick={() => navigate("/menu")}
              className="bg-orange-500 text-white px-10 py-4 rounded-xl font-bold hover:bg-orange-600 transition-all"
            >
              Explore Menu
            </button>
          </div>
        ) : (
          /* Cart Content Layout */
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div 
                  key={item._id} 
                  className="flex flex-col sm:flex-row items-center gap-6 bg-[#111111] p-6 rounded-2xl border border-white/5 shadow-xl"
                >
                  <img 
                    src={item.image || "https://via.placeholder.com"} 
                    alt={item.name} 
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                    <p className="text-orange-500 font-bold">₹{item.price}</p>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4 bg-black border border-white/10 px-4 py-2 rounded-xl">
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="text-gray-400 hover:text-orange-500 transition-colors"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="font-bold w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="text-gray-400 hover:text-orange-500 transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-500 hover:bg-red-500/10 p-3 rounded-full transition-all"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary Card */}
            <div className="bg-[#111111] p-8 rounded-3xl border border-white/10 h-fit sticky top-32 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 border-b border-white/5 pb-4">Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Taxes (GST)</span>
                  <span>₹{(total * 0.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-black text-white pt-4 border-t border-white/5">
                  <span>Total</span>
                  <span className="text-orange-500">₹{(total * 1.05).toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate("/order-summary")}
                className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-all active:scale-[0.98] shadow-lg shadow-orange-500/20"
              >
                Proceed to Checkout
              </button>
              
              <p className="text-center text-gray-500 text-xs mt-6">
                Prices include 5% GST where applicable.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
