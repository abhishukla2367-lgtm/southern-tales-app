import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; 
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

const imageMap = {
  plainDosa, idli, appam, ravaDosa, setDosa, meduVada, upma, pongal,
  drumstickSoup, tomatoSoup, prawnsRasam, broccoliTikka, mushroomFry, 
  eggRoast, pepperChicken, paneer65, chickenGheeRoast, vegKorma, 
  fishCurry, paneerButterMasala, payasam, kesari, gulabJamun, 
  coconutLadoo, filterCoffee, masalaTea, butterMilk, freshLime
};

const categories = ["All", "Breakfast", "Starters", "Main Course", "Desserts", "Beverages"];

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]); 
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext); 
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVeg, setSelectedVeg] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [activeHero, setActiveHero] = useState(0);

  const heroImages = [southFoodHero, southFoodHero2, southFoodHero3];

  // Task #2: Connect to MongoDB via Backend
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/menu") 
      .then(res => res.json())
      .then(data => {
        setMenuItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Database error:", err);
        setLoading(false);
      });
  }, []);

  // Hero Slider
  useEffect(() => {
    const interval = setInterval(() => setActiveHero((prev) => (prev + 1) % heroImages.length), 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Task #4: Login requirement logic for Ordering
  const handleAddToCart = (item) => {
    if (!user) {
      alert("Professional Note: Please login to add items to your cart.");
      navigate("/login");
      return;
    }
    addToCart(item);
  };

  const filteredItems = menuItems.filter((item) => {
    const matchCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchVeg = selectedVeg === "All" || (selectedVeg === "Veg" && item.veg) || (selectedVeg === "NonVeg" && !item.veg);
    
    let matchPrice = true;
    if (selectedPrice === "Under200") matchPrice = item.price < 200;
    else if (selectedPrice === "200to400") matchPrice = item.price >= 200 && item.price <= 400;
    else if (selectedPrice === "Above400") matchPrice = item.price > 400;

    return matchCategory && matchSearch && matchVeg && matchPrice;
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* TASK #1: HERO SECTION FIX (Visibility & Contrast) */}
      {/* HERO SLIDER (Text removed from here for professional look) */}
<div className="relative h-[350px] overflow-hidden">
  {heroImages.map((img, index) => (
    <img
      key={index}
      src={img}
      alt="Hero"
      className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${index === activeHero ? "opacity-100" : "opacity-0"}`}
    />
  ))}
  <div className="absolute inset-0 bg-black/30"></div>
</div>

{/* MAIN CONTENT AREA */}
<div className="max-w-7xl mx-auto px-4 relative z-20">
  
  {/* SECTION TITLE - Positioned professionally above the filter */}
  <div className="text-center mb-8 -mt-16"> 
    <h2 className="text-orange-500 text-4xl md:text-5xl font-bold font-serif bg-gray-50 inline-block px-8 py-2 rounded-t-lg shadow-sm">
      Our Menu
    </h2>
    <div className="h-1 w-24 bg-orange-500 mx-auto mt-2 rounded-full"></div>
  </div>

  {/* FILTER SECTION */}
  <div id="menu-section" className="bg-white p-6 rounded-xl shadow-2xl grid grid-cols-1 md:grid-cols-4 gap-6 border border-gray-100">
    <div className="flex flex-col">
      <label className="text-xs font-bold text-gray-500 uppercase mb-1">Search Dishes</label>
      <input type="text" placeholder="e.g. Masala Dosa" className="p-2 border rounded bg-gray-50 focus:ring-2 focus:ring-orange-500 outline-none text-gray-800" onChange={(e) => setSearchTerm(e.target.value)} />
    </div>
    <div className="flex flex-col">
      <label className="text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
      <select className="p-2 border rounded bg-gray-50 text-gray-800 shadow-sm" onChange={(e) => setSelectedCategory(e.target.value)}>
        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
      </select>
    </div>
    <div className="flex flex-col">
      <label className="text-xs font-bold text-gray-500 uppercase mb-1">Dietary</label>
      <select className="p-2 border rounded bg-gray-50 text-gray-800" onChange={(e) => setSelectedVeg(e.target.value)}>
        <option value="All">All Types</option>
        <option value="Veg">Veg</option>
        <option value="NonVeg">Non-Veg</option>
      </select>
    </div>
    <div className="flex flex-col">
      <label className="text-xs font-bold text-gray-500 uppercase mb-1">Price Range</label>
      <select className="p-2 border rounded bg-gray-50 text-gray-800" onChange={(e) => setSelectedPrice(e.target.value)}>
        <option value="All">All Prices</option>
        <option value="Under200">Under ₹200</option>
        <option value="200to400">₹200 - ₹400</option>
        <option value="Above400">Above ₹400</option>
      </select>
    </div>
  </div>
</div>


      {/* TASK #1 & #2: MENU GRID & LOADING STATE */}
      <div className="max-w-7xl mx-auto px-4 mt-16">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            <p className="ml-4 text-gray-700 font-medium">Fetching our menu...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredItems.map((item) => (
              <div key={item._id || item.name} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col">
                <div className="relative h-52">
                  <img src={imageMap[item.image]} alt={item.name} className="w-full h-full object-cover" />
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-white shadow-md ${item.veg ? 'bg-green-600' : 'bg-red-600'}`}>
                    {item.veg ? 'VEG' : 'NON-VEG'}
                  </div>
                </div>
                
                {/* TASK #1: FIX TEXT VISIBILITY (High Contrast Gray-900) */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">{item.name}</h3>
                    <span className="text-orange-600 font-extrabold text-lg">₹{item.price}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-6 flex-grow">
                    {item.description || "Authentic South Indian taste served fresh with traditional sides."}
                  </p>
                  
                  {/* Task #4 & #8: Add to Cart Trigger */}
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg active:scale-95"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">No items found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
