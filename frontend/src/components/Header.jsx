import React, { useState, useContext } from "react"; // ✅ Import useContext
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Phone, Menu, X, UserCircle, LogOut } from "lucide-react";
import logo from "../assets/images/logo/southern-tales-logo.jpeg";
import { AuthContext } from "../context/AuthContext"; // ✅ Import your AuthContext
import { useCart } from "../context/CartContext";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    // ✅ TASK 3: Use global Auth state instead of local mock state
    const { isLoggedIn, user, logout } = useContext(AuthContext);

    const navigate = useNavigate();
    const { cartItems } = useCart(); 
    const cartCount = cartItems.length;  // This should eventually come from CartContext

    const handleLogout = () => {
        logout(); // ✅ Use the logout function from Context (Task 3)
        navigate("/");
    };

    return (
        <header className="fixed top-0 left-0 w-full z-50">
            {/* HEADER BAR */}
            <div className="flex items-center justify-between px-6 lg:px-12 py-4 bg-[#1f1b16] shadow-lg">

                {/* LEFT: LOGO */}
                <Link to="/" className="flex items-center gap-3">
                    <img src={logo} alt="Southern Tales" className="w-14 h-auto rounded-md" />
                    <span className="text-2xl font-bold text-white tracking-tight">
                        Southern Tales
                    </span>
                </Link>

                {/* CENTER: DESKTOP NAV - TASK 4: Browsing links always accessible */}
                <nav className="hidden lg:flex gap-8 font-medium text-gray-200">
                    {[
                        ["Home", "/"],
                        ["Menu", "/menu"],
                        ["About Us", "/about"],
                        ["Gallery", "/gallery"],
                        ["Reservation", "/reservation"],
                        ["Contact", "/contactus"]
                    ].map(([label, path]) => (
                        <Link
                            key={path}
                            to={path}
                            className="hover:text-[#f5c27a] transition-colors duration-300"
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                {/* RIGHT: ACTIONS */}
                <div className="hidden lg:flex items-center gap-5 text-white">
                    <button
                        onClick={() => window.open("tel:+919999999999")}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#f5c27a] bg-white/5 hover:bg-white/10 transition"
                    >
                        <Phone size={16} className="text-[#f5c27a]" />
                        <span className="text-sm font-medium">Call Now</span>
                    </button>

                    {/* CART */}
                    <button onClick={() => navigate("/cart")} className="relative group p-2">
                        <ShoppingCart size={22} className="group-hover:text-[#f5c27a] transition-colors" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#f5c27a] text-black text-[10px] font-bold flex items-center justify-center">
                            {cartCount}
                        </span>
                    </button>

                    {/* AUTHENTICATION CONDITIONAL RENDERING - TASK 3 */}
                    <div className="flex items-center gap-3 ml-2 border-l border-white/10 pl-5">
                        {!isLoggedIn ? (
                            <>
                                {/* Show Login button when logged out */}
                                <button
                                    onClick={() => navigate("/login")}
                                    className="px-5 py-2 rounded-full text-white hover:text-[#f5c27a] transition-all text-sm font-semibold"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate("/register")}
                                    className="px-5 py-2 rounded-full bg-[#f5c27a] text-black hover:bg-[#e3b26a] transition-all text-sm font-bold shadow-md"
                                >
                                    Register
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Show Profile icon when logged in */}
                                <button
                                    onClick={() => navigate("/profile")}
                                    className="flex items-center gap-2 text-white hover:text-[#f5c27a] transition-all group"
                                >
                                    
                                    <UserCircle size={32} className="text-[#f5c27a]" />
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* MOBILE MENU TOGGLE */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden text-white hover:text-[#f5c27a]"
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* MOBILE MENU - Corrected to handle Task 3 & 4 */}
            {isOpen && (
                <div className="lg:hidden bg-[#231a14] px-6 py-8 space-y-6 text-white border-t border-white/5">
                    <div className="flex flex-col gap-5">
                        {["Home", "Menu", "About Us", "Gallery", "Reservation", "Contact"].map((label) => (
                            <Link
                                key={label}
                                to={label === "Home" ? "/" : `/${label.toLowerCase().replace(" ", "")}`}
                                onClick={() => setIsOpen(false)}
                                className="text-lg font-medium hover:text-[#f5c27a]"
                            >
                                {label}
                            </Link>
                        ))}
                    </div>

                    <div className="pt-6 border-t border-white/10 space-y-4">
                        {!isLoggedIn ? (
                            <div className="flex gap-4">
                                <button
                                    onClick={() => { navigate("/login"); setIsOpen(false); }}
                                    className="w-full py-3 rounded-xl border border-[#f5c27a] text-[#f5c27a] font-bold"
                                >
                                    Login
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => { navigate("/profile"); setIsOpen(false); }}
                                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white/5 border border-white/10 font-bold"
                            >
                                <UserCircle size={24} className="text-[#f5c27a]" />
                                {user?.name || "Profile"}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
