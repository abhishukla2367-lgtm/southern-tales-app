import React from "react";

const menuData = [
  { name: "Plain Dosa", category: "Breakfast", price: 165, veg: true, description: "Crispy rice crepe with sambar & chutney", image: "plainDosa" },
  { name: "Idli (2 pcs)", category: "Breakfast", price: 120, veg: true, description: "Soft steamed rice cakes with chutney & sambar", image: "idli" },
  { name: "Appam (2 pcs)", category: "Breakfast", price: 140, veg: true, description: "Soft lacy Kerala pancakes", image: "appam" },
  { name: "Rava Dosa", category: "Breakfast", price: 150, veg: true, description: "Thin semolina crepe", image: "ravaDosa"},
  { name: "Set Dosa", category: "Breakfast", price: 160, veg: true, description: "Soft spongy dosas (2 pcs)", image: "setDosa" },
  { name: "Medu Vada (2 pcs)", category: "Breakfast", price: 130, veg: true, description: "Crispy lentil fritters", image: "meduVada" },
  { name: "Upma", category: "Breakfast", price: 120, veg: true, description: "Savory semolina porridge", image: "upma" },
  { name: "Pongal", category: "Breakfast", price: 150, veg: true, description: "Comfort rice & lentil dish", image: "pongal" },

  { name: "Drumstick Coriander Soup", category: "Starters", price: 325, veg: true, description: "Earthy herbal soup", image: "drumstickSoup" },
  { name: "Madras Tomato Soup", category: "Starters", price: 300, veg: true, description: "Spiced tomato soup", image: "tomatoSoup" },
  { name: "Prawns Rasam", category: "Starters", price: 450, veg: false, description: "Tangy prawn rasam", image: "prawnsRasam" },
  { name: "Broccoli Tikka", category: "Starters", price: 350, veg: true, description: "Marinated grilled broccoli", image: "broccoliTikka" },
  { name: "Kanthari Mushroom Fry", category: "Starters", price: 380, veg: true, description: "Spicy sautéed mushrooms", image: "mushroomFry" },
  { name: "Egg Roast", category: "Starters", price: 280, veg: false, description: "Kerala-style egg roast", image: "eggRoast" },
  { name: "Pepper Fried Chicken", category: "Starters", price: 450, veg: false, description: "Peppery fried chicken", image: "pepperChicken" },
  { name: "Paneer 65", category: "Starters", price: 350, veg: true, description: "Crispy fried paneer", image: "paneer65" },

  { name: "Chicken Ghee Roast", category: "Main Course", price: 550, veg: false, description: "Spicy coastal ghee roast", image: "chickenGheeRoast" },
  { name: "Vegetable Korma", category: "Main Course", price: 420, veg: true, description: "Creamy mixed veg curry", image: "vegKorma" },
  { name: "Fish Curry", category: "Main Course", price: 520, veg: false, description: "Traditional South Indian fish curry", image: "fishCurry" },
  { name: "Paneer Butter Masala", category: "Main Course", price: 450, veg: true, description: "Rich tomato-based gravy", image: "paneerButterMasala" },

  { name: "Payasam", category: "Desserts", price: 180, veg: true, description: "Traditional sweet pudding", image: "payasam" },
  { name: "Kesari", category: "Desserts", price: 150, veg: true, description: "Semolina saffron dessert", image: "kesari" },
  { name: "Gulab Jamun", category: "Desserts", price: 160, veg: true, description: "Soft syrupy dumplings", image: "gulabJamun" },
  { name: "Coconut Ladoo", category: "Desserts", price: 140, veg: true, description: "Fresh coconut sweets", image: "coconutLadoo" },

  { name: "Filter Coffee", category: "Beverages", price: 90, veg: true, description: "Authentic South Indian coffee", image: "filterCoffee" },
  { name: "Masala Tea", category: "Beverages", price: 80, veg: true, description: "Spiced Indian chai", image: "masalaTea" },
  { name: "Buttermilk", category: "Beverages", price: 70, veg: true, description: "Refreshing spiced buttermilk", image: "butterMilk" },
  { name: "Fresh Lime Soda", category: "Beverages", price: 90, veg: true, description: "Chilled lime refreshment", image: "freshLime" },
];
export default function SeedMenu() {
  const uploadMenu = async () => {
    for (const item of menuData) {
      try {
        const response = await fetch("http://localhost:5000/api/menu/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        if (response.ok) console.log(`Uploaded: ${item.name}`);
      } catch (err) {
        console.error(`Failed: ${item.name}`, err);
      }
    }
    alert("All 28 items processed! Check your MongoDB console.");
  };

  return (
    <div className="p-10 text-center">
      <button 
        onClick={uploadMenu}
        className="bg-orange-600 text-white px-6 py-3 rounded-lg font-bold shadow-lg"
      >
        Click Once to Seed 28 Menu Items
      </button>
    </div>
  );
}
