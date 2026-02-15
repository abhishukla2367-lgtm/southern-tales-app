import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext"; // ✅ Task 8: Cart Logic


/* ================= IMAGE IMPORTS ================= */
import southFoodHero from "../assets/images/hero/south-food.jpg";
import southFoodHero2 from "../assets/images/hero/south-food2.jpg";
import southFoodHero3 from "../assets/images/hero/south-food3.jpg";

/* Breakfast */
import plainDosa from "../assets/images/menu/breakfast/plain-dosa.jpg";
import idli from "../assets/images/menu/breakfast/idli.jpg";
import appam from "../assets/images/menu/breakfast/appam.jpg";
import ravaDosa from "../assets/images/menu/breakfast/rava-dosa.jpg";
import setDosa from "../assets/images/menu/breakfast/set-dosa.jpg";
import meduVada from "../assets/images/menu/breakfast/medu-vada.jpg";
import upma from "../assets/images/menu/breakfast/upma.jpg";
import pongal from "../assets/images/menu/breakfast/pongal.jpg";

/* Starters */
import drumstickSoup from "../assets/images/menu/starters/drumstick-soup.jpg";
import tomatoSoup from "../assets/images/menu/starters/tomato-soup.jpg";
import prawnsRasam from "../assets/images/menu/starters/prawns-rasam.jpg";
import broccoliTikka from "../assets/images/menu/starters/broccoli-tikka.jpg";
import mushroomFry from "../assets/images/menu/starters/mushroom-fry.jpg";
import eggRoast from "../assets/images/menu/starters/egg-roast.jpg";
import pepperChicken from "../assets/images/menu/starters/pepper-chicken.jpg";
import paneer65 from "../assets/images/menu/starters/paneer-65.jpg";

/* Main Course */
import chickenGheeRoast from "../assets/images/menu/main-course/chicken-ghee-roast.jpg";
import vegKorma from "../assets/images/menu/main-course/veg-korma.jpg";
import fishCurry from "../assets/images/menu/main-course/fish-curry.jpg";
import paneerButterMasala from "../assets/images/menu/main-course/paneer-butter-masala.jpg";

/* Desserts */
import payasam from "../assets/images/menu/desserts/payasam.jpg";
import kesari from "../assets/images/menu/desserts/kesari.jpg";
import gulabJamun from "../assets/images/menu/desserts/gulab-jamun.jpg";
import coconutLadoo from "../assets/images/menu/desserts/coconut-ladoo.jpg";

/* Beverages */
import filterCoffee from "../assets/images/menu/beverages/filter-coffee.jpg";
import masalaTea from "../assets/images/menu/beverages/masala-tea.jpg";
import butterMilk from "../assets/images/menu/beverages/buttermilk.jpg";
import freshLime from "../assets/images/menu/beverages/fresh-lime.jpg";

/* ================= MENU ITEMS WITH NUMERIC PRICES ================= */
const menuItems = [
    { name: "Plain Dosa", category: "Breakfast", price: 165, veg: true, description: "Crispy rice crepe with sambar & chutney", image: plainDosa },
    { name: "Idli (2 pcs)", category: "Breakfast", price: 120, veg: true, description: "Soft steamed rice cakes with chutney & sambar", image: idli },
    { name: "Appam (2 pcs)", category: "Breakfast", price: 140, veg: true, description: "Soft lacy Kerala pancakes", image: appam },
    { name: "Rava Dosa", category: "Breakfast", price: 150, veg: true, description: "Thin semolina crepe", image: ravaDosa },
    { name: "Set Dosa", category: "Breakfast", price: 160, veg: true, description: "Soft spongy dosas (2 pcs)", image: setDosa },
    { name: "Medu Vada (2 pcs)", category: "Breakfast", price: 130, veg: true, description: "Crispy lentil fritters", image: meduVada },
    { name: "Upma", category: "Breakfast", price: 120, veg: true, description: "Savory semolina porridge", image: upma },
    { name: "Pongal", category: "Breakfast", price: 150, veg: true, description: "Comfort rice & lentil dish", image: pongal },

    { name: "Drumstick Coriander Soup", category: "Starters", price: 325, veg: true, description: "Earthy herbal soup", image: drumstickSoup },
    { name: "Madras Tomato Soup", category: "Starters", price: 300, veg: true, description: "Spiced tomato soup", image: tomatoSoup },
    { name: "Prawns Rasam", category: "Starters", price: 450, veg: false, description: "Tangy prawn rasam", image: prawnsRasam },
    { name: "Broccoli Tikka", category: "Starters", price: 350, veg: true, description: "Marinated grilled broccoli", image: broccoliTikka },
    { name: "Kanthari Mushroom Fry", category: "Starters", price: 380, veg: true, description: "Spicy sautéed mushrooms", image: mushroomFry },
    { name: "Egg Roast", category: "Starters", price: 280, veg: false, description: "Kerala-style egg roast", image: eggRoast },
    { name: "Pepper Fried Chicken", category: "Starters", price: 450, veg: false, description: "Peppery fried chicken", image: pepperChicken },
    { name: "Paneer 65", category: "Starters", price: 350, veg: true, description: "Crispy fried paneer", image: paneer65 },

    { name: "Chicken Ghee Roast", category: "Main Course", price: 550, veg: false, description: "Spicy coastal ghee roast", image: chickenGheeRoast },
    { name: "Vegetable Korma", category: "Main Course", price: 420, veg: true, description: "Creamy mixed veg curry", image: vegKorma },
    { name: "Fish Curry", category: "Main Course", price: 520, veg: false, description: "Traditional South Indian fish curry", image: fishCurry },
    { name: "Paneer Butter Masala", category: "Main Course", price: 450, veg: true, description: "Rich tomato-based gravy", image: paneerButterMasala },

    { name: "Payasam", category: "Desserts", price: 180, veg: true, description: "Traditional sweet pudding", image: payasam },
    { name: "Kesari", category: "Desserts", price: 150, veg: true, description: "Semolina saffron dessert", image: kesari },
    { name: "Gulab Jamun", category: "Desserts", price: 160, veg: true, description: "Soft syrupy dumplings", image: gulabJamun },
    { name: "Coconut Ladoo", category: "Desserts", price: 140, veg: true, description: "Fresh coconut sweets", image: coconutLadoo },

    { name: "Filter Coffee", category: "Beverages", price: 90, veg: true, description: "Authentic South Indian coffee", image: filterCoffee },
    { name: "Masala Tea", category: "Beverages", price: 80, veg: true, description: "Spiced Indian chai", image: masalaTea },
    { name: "Buttermilk", category: "Beverages", price: 70, veg: true, description: "Refreshing spiced buttermilk", image: butterMilk },
    { name: "Fresh Lime Soda", category: "Beverages", price: 90, veg: true, description: "Chilled lime refreshment", image: freshLime },
];

const categories = ["All", "Breakfast", "Starters", "Main Course", "Desserts", "Beverages"];

export default function Menu() {
    const { addToCart } = useCart();
    const { isLoggedIn } = useContext(AuthContext); // ✅ Listen to login state
    const navigate = useNavigate();

    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [activeHero, setActiveHero] = useState(0);

    const heroImages = [southFoodHero, southFoodHero2, southFoodHero3];

    useEffect(() => {
        const interval = setInterval(() => setActiveHero((prev) => (prev + 1) % heroImages.length), 5000);
        return () => clearInterval(interval);
    }, [heroImages.length]);

    // ✅ FIXED ACTION: Handles Task 4 logic without asking twice
    const handleAddToCart = (item) => {
        const token = localStorage.getItem("token"); // Double check local storage
        
        if (!isLoggedIn && !token) {
            // Task 4: Ordering food requires login
            alert("Please login to add items to your cart!");
            navigate("/login");
            return;
        }
        
        // If logged in (via Context OR Token), allow the action
        addToCart(item);
    };

    const filteredItems = menuItems.filter((item) => {
        const matchCategory = selectedCategory === "All" || item.category === selectedCategory;
        const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCategory && matchSearch;
    });

    return (
        <div className="bg-[#0f0e0d] min-h-screen text-white pt-24 pb-20 font-sans">
            {/* HERO CAROUSEL */}
            <div className="relative h-[45vh] w-full overflow-hidden">
                {heroImages.map((img, idx) => (
                    <img
                        key={idx}
                        src={img}
                        alt="South Food"
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 brightness-50 ${activeHero === idx ? "opacity-100" : "opacity-0"}`}
                    />
                ))}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-2">
                        Southern <span className="text-[#f5c27a]">Tales</span> Menu
                    </h1>
                    <div className="w-24 h-1 bg-[#f5c27a] rounded-full"></div>
                </div>
            </div>

            {/* FILTER BAR */}
            <div className="max-w-7xl mx-auto px-6 mt-12">
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-[#1a1612] p-8 rounded-3xl border border-white/5 shadow-2xl">
                    <input 
                        type="text" 
                        placeholder="Search for a dish..." 
                        className="bg-black/50 border border-white/10 px-6 py-3 rounded-2xl focus:ring-1 focus:ring-[#f5c27a] outline-none w-full md:w-80 text-sm placeholder:text-gray-600"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="flex flex-wrap gap-2 justify-center">
                        {categories.map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2 rounded-full text-[10px] uppercase tracking-widest font-black transition-all ${selectedCategory === cat ? "bg-[#f5c27a] text-black shadow-lg shadow-[#f5c27a]/20" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* GRID DISPLAY */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                    {filteredItems.map((item, idx) => (
                        <div key={idx} className="bg-[#1a1612] rounded-[2rem] overflow-hidden border border-white/5 group hover:border-[#f5c27a]/40 transition-all duration-500 flex flex-col shadow-xl">
                            <div className="h-56 overflow-hidden relative">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[9px] font-bold tracking-tighter uppercase ${item.veg ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
                                    {item.veg ? "Veg" : "Non-Veg"}
                                </div>
                            </div>
                            <div className="p-7 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-lg tracking-tight leading-tight group-hover:text-[#f5c27a] transition-colors">{item.name}</h3>
                                    <span className="text-[#f5c27a] font-black italic ml-2">₹{item.price}</span>
                                </div>
                                <p className="text-gray-500 text-xs mb-8 line-clamp-2 font-medium leading-relaxed">{item.description}</p>

                           <button
    onClick={() => handleAddToCart(item)}
    className="w-full sm:w-auto px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-orange-500/20 uppercase tracking-wider text-sm"
>
    Add to Cart
</button>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}