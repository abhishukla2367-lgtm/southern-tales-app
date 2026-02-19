require("dotenv").config();
const dns = require("node:dns");
const mongoose = require("mongoose");
const Menu = require("./models/Menu");
dns.setServers(["8.8.8.8", "1.1.1.1"]); 

const menuItems = [
  // ===== BREAKFAST =====
  {
    name: "Plain Dosa",
    category: "Breakfast",
    price: 165,
    veg: true,
    description: "Crispy rice crepe with sambar & chutney",
    image: "plainDosa",
    isAvailable: true,
  },
  {
    name: "Idli (2 pcs)",
    category: "Breakfast",
    price: 120,
    veg: true,
    description: "Soft steamed rice cakes with chutney & sambar",
    image: "idli",
    isAvailable: true,
  },
  {
    name: "Appam (2 pcs)",
    category: "Breakfast",
    price: 140,
    veg: true,
    description: "Soft lacy Kerala pancakes",
    image: "appam",
    isAvailable: true,
  },
  {
    name: "Rava Dosa",
    category: "Breakfast",
    price: 150,
    veg: true,
    description: "Thin semolina crepe",
    image: "ravaDosa",
    isAvailable: true,
  },
  {
    name: "Set Dosa",
    category: "Breakfast",
    price: 160,
    veg: true,
    description: "Soft spongy dosas (2 pcs)",
    image: "setDosa",
    isAvailable: true,
  },
  {
    name: "Medu Vada (2 pcs)",
    category: "Breakfast",
    price: 130,
    veg: true,
    description: "Crispy lentil fritters",
    image: "meduVada",
    isAvailable: true,
  },
  {
    name: "Upma",
    category: "Breakfast",
    price: 120,
    veg: true,
    description: "Savory semolina porridge",
    image: "upma",
    isAvailable: true,
  },
  {
    name: "Pongal",
    category: "Breakfast",
    price: 150,
    veg: true,
    description: "Comfort rice & lentil dish",
    image: "pongal",
    isAvailable: true,
  },

  // ===== STARTERS =====
  {
    name: "Drumstick Coriander Soup",
    category: "Starters",
    price: 325,
    veg: true,
    description: "Earthy herbal soup",
    image: "drumstickSoup",
    isAvailable: true,
  },
  {
    name: "Madras Tomato Soup",
    category: "Starters",
    price: 300,
    veg: true,
    description: "Spiced tomato soup",
    image: "tomatoSoup",
    isAvailable: true,
  },
  {
    name: "Prawns Rasam",
    category: "Starters",
    price: 450,
    veg: false,
    description: "Tangy prawn rasam",
    image: "prawnsRasam",
    isAvailable: true,
  },
  {
    name: "Broccoli Tikka",
    category: "Starters",
    price: 350,
    veg: true,
    description: "Marinated grilled broccoli",
    image: "broccoliTikka",
    isAvailable: true,
  },
  {
    name: "Kanthari Mushroom Fry",
    category: "Starters",
    price: 380,
    veg: true,
    description: "Spicy sautéed mushrooms",
    image: "mushroomFry",
    isAvailable: true,
  },
  {
    name: "Egg Roast",
    category: "Starters",
    price: 280,
    veg: false,
    description: "Kerala-style egg roast",
    image: "eggRoast",
    isAvailable: true,
  },
  {
    name: "Pepper Fried Chicken",
    category: "Starters",
    price: 450,
    veg: false,
    description: "Peppery fried chicken",
    image: "pepperChicken",
    isAvailable: true,
  },
  {
    name: "Paneer 65",
    category: "Starters",
    price: 350,
    veg: true,
    description: "Crispy fried paneer",
    image: "paneer65",
    isAvailable: true,
  },

  // ===== MAIN COURSE =====
  {
    name: "Chicken Ghee Roast",
    category: "Main Course",
    price: 550,
    veg: false,
    description: "Spicy coastal ghee roast",
    image: "chickenGheeRoast",
    isAvailable: true,
  },
  {
    name: "Vegetable Korma",
    category: "Main Course",
    price: 420,
    veg: true,
    description: "Creamy mixed veg curry",
    image: "vegKorma",
    isAvailable: true,
  },
  {
    name: "Fish Curry",
    category: "Main Course",
    price: 520,
    veg: false,
    description: "Traditional South Indian fish curry",
    image: "fishCurry",
    isAvailable: true,
  },
  {
    name: "Paneer Butter Masala",
    category: "Main Course",
    price: 450,
    veg: true,
    description: "Rich tomato-based gravy",
    image: "paneerButterMasala",
    isAvailable: true,
  },

  // ===== DESSERTS =====
  {
    name: "Payasam",
    category: "Desserts",
    price: 180,
    veg: true,
    description: "Traditional sweet pudding",
    image: "payasam",
    isAvailable: true,
  },
  {
    name: "Kesari",
    category: "Desserts",
    price: 150,
    veg: true,
    description: "Semolina saffron dessert",
    image: "kesari",
    isAvailable: true,
  },
  {
    name: "Gulab Jamun",
    category: "Desserts",
    price: 160,
    veg: true,
    description: "Soft syrupy dumplings",
    image: "gulabJamun",
    isAvailable: true,
  },
  {
    name: "Coconut Ladoo",
    category: "Desserts",
    price: 140,
    veg: true,
    description: "Fresh coconut sweets",
    image: "coconutLadoo",
    isAvailable: true,
  },

  // ===== BEVERAGES =====
  {
    name: "Filter Coffee",
    category: "Beverages",
    price: 90,
    veg: true,
    description: "Authentic South Indian coffee",
    image: "filterCoffee",
    isAvailable: true,
  },
  {
    name: "Masala Tea",
    category: "Beverages",
    price: 80,
    veg: true,
    description: "Spiced Indian chai",
    image: "masalaTea",
    isAvailable: true,
  },
  {
    name: "Buttermilk",
    category: "Beverages",
    price: 70,
    veg: true,
    description: "Refreshing spiced buttermilk",
    image: "butterMilk",
    isAvailable: true,
  },
  {
    name: "Fresh Lime Soda",
    category: "Beverages",
    price: 90,
    veg: true,
    description: "Chilled lime refreshment",
    image: "freshLime",
    isAvailable: true,
  },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB Atlas");

    await Menu.deleteMany({});
    console.log("🗑️  Cleared existing menu items");

    const inserted = await Menu.insertMany(menuItems);
    console.log(`✅ Successfully seeded ${inserted.length} menu items!`);

    console.log("\n📋 Seeded items by category:");
    const categories = ["Breakfast", "Starters", "Main Course", "Desserts", "Beverages"];
    categories.forEach((cat) => {
      const count = inserted.filter((i) => i.category === cat).length;
      console.log(`   ${cat}: ${count} items`);
    });

    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Seed Error:", err.message);
    process.exit(1);
  });