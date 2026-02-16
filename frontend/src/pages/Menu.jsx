import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

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
  const { addToCart } = useCart(); // Cart context
  const user = JSON.parse(localStorage.getItem("user"));
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVeg, setSelectedVeg] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [activeHero, setActiveHero] = useState(0);

  const heroImages = [southFoodHero, southFoodHero2, southFoodHero3];

  useEffect(() => {
    const interval = setInterval(() => setActiveHero((prev) => (prev + 1) % heroImages.length), 3000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const location = useLocation();
  useEffect(() => {
    if (location.state?.scrollToId) {
      const el = document.getElementById(location.state.scrollToId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const filteredItems = menuItems.filter((item) => {
    const matchCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchVeg =
      selectedVeg === "All" || (selectedVeg === "Veg" && item.veg) || (selectedVeg === "NonVeg" && !item.veg);
    const priceNum = Number(item.price); // item.price is already a number
    let matchPrice = true;
    if (selectedPrice === "Under200") matchPrice = priceNum < 200;
    else if (selectedPrice === "200to400") matchPrice = priceNum >= 200 && priceNum <= 400;
    else if (selectedPrice === "Above400") matchPrice = priceNum > 400;
    return matchCategory && matchSearch && matchVeg && matchPrice;
  });

 

  return (
  <div className="bg-black min-h-screen text-white pb-20">
    {/* 1. RESTORED ANIMATED HERO SECTION */}
    <div className="relative h-[450px] w-full overflow-hidden border-b border-zinc-900">
      {heroImages.map((img, idx) => (
        <img
          key={idx}
          src={img}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            activeHero === idx ? "opacity-50" : "opacity-0"
          }`}
          alt="Hero"
        />
      ))}
      {/* Dark Overlays for professional visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <span className="text-[#f5c27a] font-black tracking-[0.3em] text-xs mb-4 uppercase">
          Authentic Flavours
        </span>
        <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-white mb-4">
          OUR MENU
        </h1>
        <div className="h-1.5 w-24 bg-[#f5c27a] rounded-full" />
      </div>
    </div>

    {/* 2. WORKING SEARCH & FILTERS */}
    <div className="max-w-7xl mx-auto px-4 mt-12 space-y-8">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-[#0a0a0a] p-6 rounded-[2rem] border border-zinc-900">
        {/* Search Bar */}
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search for a dish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-3 text-white focus:border-[#f5c27a] outline-none transition-all"
          />
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-xl font-bold text-xs uppercase transition-all ${
                selectedCategory === cat
                  ? "bg-[#f5c27a] text-black"
                  : "bg-black text-zinc-400 border border-zinc-800 hover:border-zinc-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. MENU GRID (Perfect Alignment Fixed) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredItems.map((dish, index) => (
          <div
            key={index}
            className="flex flex-col bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden border border-zinc-900 hover:border-[#f5c27a]/30 transition-all duration-500 h-full shadow-2xl"
          >
            {/* Image (Fixed Aspect Ratio) */}
            <div className="relative h-56 overflow-hidden">
              <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${
                  dish.veg ? "bg-green-500/10 border-green-500/50 text-green-400" : "bg-red-500/10 border-red-500/50 text-red-400"
                }`}>
                  {dish.veg ? "● VEG" : "▲ NON-VEG"}
                </span>
              </div>
            </div>

            {/* Content Wrapper (Uses flex-1 to push footer down) */}
            <div className="p-7 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2">{dish.name}</h3>
              <p className="text-zinc-500 text-sm mb-8 line-clamp-2 leading-relaxed">
                {dish.description}
              </p>

              {/* FOOTER: Perfectly aligned across all cards */}
              <div className="mt-auto pt-5 border-t border-zinc-900 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Price</span>
                  <span className="text-2xl font-black text-white">₹{dish.price}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(dish, !!user);
                  }}
                  className="bg-[#f5c27a] hover:bg-white active:scale-90 text-black font-black px-6 py-3 rounded-2xl transition-all duration-300 shadow-[0_10px_20px_-10px_rgba(245,194,122,0.4)] text-xs uppercase"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
}