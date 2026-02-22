// seed.js — South Indian Restaurant Menu Seed Data (75 items)
// Usage: node seed.js  (requires mongoose + MONGO_URI in .env)

const mongoose = require("mongoose");
const dns = require("node:dns");
require("dotenv").config();
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const menuItemSchema = new mongoose.Schema({
  _id: String,
  name: String,
  category: {
    type: String,
    enum: ["Breakfast", "Starters", "Main Course", "Desserts", "Beverages"],
  },
  price: Number,
  veg: Boolean,
  vegan: Boolean,
  dietary: Boolean,
  description: String,
  image: String, // relative path or URL — update as needed
});

const MenuItem = mongoose.model("Menu", menuItemSchema, "menu");

const menuItems = [
  // ─────────────────────────────────────────────────────────────
  // BREAKFAST (15)
  // ─────────────────────────────────────────────────────────────
  {
    _id: "a1",
    name: "Plain Dosa",
    category: "Breakfast",
    price: 165,
    veg: true,
    vegan: true,
    dietary: false,
    description: "Crispy golden rice crepe served with sambar & two chutneys",
    image: "assets/images/menu/breakfast/plain-dosa.jpg",
  },
  {
    _id: "a2",
    name: "Idli (2 pcs)",
    category: "Breakfast",
    price: 120,
    veg: true,
    vegan: true,
    dietary: true,
    description:
      "Pillowy steamed rice cakes served with coconut chutney & sambar",
    image: "assets/images/menu/breakfast/idli.jpg",
  },
  {
    _id: "a3",
    name: "Appam (2 pcs)",
    category: "Breakfast",
    price: 140,
    veg: true,
    vegan: false,
    dietary: false,
    description:
      "Soft lacy Kerala rice pancakes — best with coconut milk stew",
    image: "assets/images/menu/breakfast/appam.jpg",
  },
  {
    _id: "a4",
    name: "Rava Dosa",
    category: "Breakfast",
    price: 150,
    veg: true,
    vegan: true,
    dietary: false,
    description: "Thin, crispy semolina crepe with onion & green chilli",
    image: "assets/images/menu/breakfast/rava-dosa.jpg",
  },
  {
    _id: "a5",
    name: "Set Dosa",
    category: "Breakfast",
    price: 160,
    veg: true,
    vegan: true,
    dietary: false,
    description: "Three soft spongy dosas served with sagu & chutney",
    image: "assets/images/menu/breakfast/set-dosa.jpg",
  },
  {
    _id: "a6",
    name: "Medu Vada (2 pcs)",
    category: "Breakfast",
    price: 130,
    veg: true,
    vegan: true,
    dietary: false,
    description:
      "Crispy lentil fritters with a fluffy interior, served with sambar",
    image: "assets/images/menu/breakfast/medu-vada.jpg",
  },
  {
    _id: "a7",
    name: "Upma",
    category: "Breakfast",
    price: 120,
    veg: true,
    vegan: false,
    dietary: true,
    description:
      "Savoury semolina porridge tempered with mustard & curry leaves",
    image: "assets/images/menu/breakfast/upma.jpg",
  },
  {
    _id: "a8",
    name: "Pongal",
    category: "Breakfast",
    price: 150,
    veg: true,
    vegan: false,
    dietary: true,
    description: "Comfort rice & lentil dish with black pepper & ghee",
    image: "assets/images/menu/breakfast/pongal.jpg",
  },
  {
    _id: "a9",
    name: "Masala Dosa",
    category: "Breakfast",
    price: 185,
    veg: true,
    vegan: true,
    dietary: false,
    description: "Crispy dosa stuffed with spiced potato masala & onion",
    image: "assets/images/menu/breakfast/masala-dosa.jpg",
  },
  {
    _id: "a10",
    name: "Uttapam",
    category: "Breakfast",
    price: 155,
    veg: true,
    vegan: true,
    dietary: true,
    description:
      "Thick rice pancake topped with onions, tomatoes & green chillies",
    image: "assets/images/menu/breakfast/uttapam.jpg",
  },
  {
    _id: "a11",
    name: "Pesarattu",
    category: "Breakfast",
    price: 145,
    veg: true,
    vegan: true,
    dietary: true,
    description:
      "Green moong dal crepe from Andhra, high-protein & crispy",
    image: "assets/images/menu/breakfast/pesarattu.jpg",
  },
  {
    _id: "a12",
    name: "Oothappam",
    category: "Breakfast",
    price: 160,
    veg: true,
    vegan: true,
    dietary: false,
    description: "Thick fermented rice pancake topped with mixed veggies",
    image: "assets/images/menu/breakfast/oothappam.jpg",
  },
  {
    _id: "a13",
    name: "Poha",
    category: "Breakfast",
    price: 110,
    veg: true,
    vegan: true,
    dietary: true,
    description:
      "Flattened rice stir-fried with turmeric, mustard & peanuts",
    image: "assets/images/menu/breakfast/poha.jpg",
  },
  {
    _id: "a14",
    name: "Ghee Roast Dosa",
    category: "Breakfast",
    price: 200,
    veg: true,
    vegan: false,
    dietary: false,
    description:
      "Extra-crispy dosa slathered generously with clarified butter",
    image: "assets/images/menu/breakfast/ghee-roast-dosa.jpg",
  },
  {
    _id: "a15",
    name: "Puttu & Kadala",
    category: "Breakfast",
    price: 175,
    veg: true,
    vegan: true,
    dietary: true,
    description:
      "Steamed rice cylinders with coconut, served with spicy black chickpea curry",
    image: "assets/images/menu/breakfast/puttu.jpg",
  },

  // ─────────────────────────────────────────────────────────────
  // STARTERS (15)
  // ─────────────────────────────────────────────────────────────
  {
    _id: "b1",
    name: "Drumstick Coriander Soup",
    category: "Starters",
    price: 325,
    veg: true,
    vegan: true,
    dietary: true,
    description:
      "Earthy drumstick & coriander broth — a South Indian classic",
    image: "assets/images/menu/starters/drumstick-soup.jpg",
  },
  {
    _id: "b2",
    name: "Madras Tomato Soup",
    category: "Starters",
    price: 300,
    veg: true,
    vegan: true,
    dietary: true,
    description:
      "Robustly spiced tomato soup tempered with South Indian spices",
    image: "assets/images/menu/starters/tomato-soup.jpg",
  },
  {
    _id: "b3",
    name: "Prawns Rasam",
    category: "Starters",
    price: 450,
    veg: false,
    vegan: false,
    dietary: false,
    description: "Tangy prawn-infused rasam, light yet deeply flavourful",
    image: "assets/images/menu/starters/prawns-rasam.jpg",
  },
  {
    _id: "b4",
    name: "Broccoli Tikka",
    category: "Starters",
    price: 350,
    veg: true,
    vegan: true,
    dietary: true,
    description: "Marinated broccoli florets, char-grilled in a tandoor",
    image: "assets/images/menu/starters/broccoli-tikka.jpg",
  },
  {
    _id: "b5",
    name: "Kanthari Mushroom Fry",
    category: "Starters",
    price: 380,
    veg: true,
    vegan: true,
    dietary: true,
    description:
      "Button mushrooms tossed with fiery bird's eye chillies",
    image: "assets/images/menu/starters/mushroom-fry.jpg",
  },
  {
    _id: "b6",
    name: "Egg Roast",
    category: "Starters",
    price: 280,
    veg: false,
    vegan: false,
    dietary: false,
    description:
      "Kerala-style boiled eggs roasted in spiced onion-tomato masala",
    image: "assets/images/menu/starters/egg-roast.jpg",
  },
  {
    _id: "b7",
    name: "Pepper Fried Chicken",
    category: "Starters",
    price: 450,
    veg: false,
    vegan: false,
    dietary: false,
    description:
      "Juicy chicken strips fried with cracked black pepper & curry leaves",
    image: "assets/images/menu/starters/pepper-chicken.jpg",
  },
  {
    _id: "b8",
    name: "Paneer 65",
    category: "Starters",
    price: 350,
    veg: true,
    vegan: false,
    dietary: false,
    description:
      "Crispy deep-fried paneer cubes tossed in a fiery red sauce",
    image: "assets/images/menu/starters/paneer-65.jpg",
  },
  {
    _id: "b9",
    name: "Chicken 65",
    category: "Starters",
    price: 420,
    veg: false,
    vegan: false,
    dietary: false,
    description:
      "South Indian spiced deep-fried chicken — Hyderabad's signature starter",
    image: "assets/images/menu/starters/chicken-65.jpg",
  },
  {
    _id: "b10",
    name: "Prawn Fry",
    category: "Starters",
    price: 480,
    veg: false,
    vegan: false,
    dietary: false,
    description:
      "Jumbo prawns marinated in masala and shallow-fried to perfection",
    image: "assets/images/menu/starters/prawn-fry.jpg",
  },
  {
    _id: "b11",
    name: "Fish Tikka",
    category: "Starters",
    price: 460,
    veg: false,
    vegan: false,
    dietary: false,
    description:
      "Tender fish fillets marinated in coastal spices and grilled",
    image: "assets/images/menu/starters/fish-tikka.jpg",
  },
  {
    _id: "b12",
    name: "Veg Seekh Kebab",
    category: "Starters",
    price: 320,
    veg: true,
    vegan: true,
    dietary: true,
    description:
      "Spiced vegetable & legume skewers, smoky off the grill",
    image: "assets/images/menu/starters/veg-kebab.jpg",
  },
  {
    _id: "b13",
    name: "Corn Cutlet",
    category: "Starters",
    price: 280,
    veg: true,
    vegan: true,
    dietary: true,
    description:
      "Crispy sweet corn & potato cutlets with green chutney",
    image: "assets/images/menu/starters/corn-cutlet.jpg",
  },
  {
    _id: "b14",
    name: "Paneer Tikka",
    category: "Starters",
    price: 380,
    veg: true,
    vegan: false,
    dietary: false,
    description:
      "Cubes of cottage cheese marinated in tandoori spices & grilled",
    image: "assets/images/menu/starters/paneer-tikka.jpg",
  },
  {
    _id: "b15",
    name: "Mutton 65",
    category: "Starters",
    price: 520,
    veg: false,
    vegan: false,
    dietary: false,
    description:
      "Tender mutton pieces deep-fried with aromatic spices & curry leaves",
    image: "assets/images/menu/starters/mutton-65.jpg",
  },

  // ─────────────────────────────────────────────────────────────
  // MAIN COURSE (15)
  // ─────────────────────────────────────────────────────────────
  {
    _id: "c1",
    name: "Chicken Ghee Roast",
    category: "Main Course",
    price: 550,
    veg: false,
    vegan: false,
    dietary: false,
    description:
      "Iconic Mangalorean coastal chicken roasted in ghee & byadgi chillies",
    image: "assets/images/menu/main-course/chicken-ghee-roast.jpg",
  },
  {
    _id: "c2",
    name: "Vegetable Korma",
    category: "Main Course",
    price: 420,
    veg: true,
    vegan: false,
    dietary: false,
    description:
      "Creamy mixed vegetable curry in a cashew & coconut sauce",
    image: "assets/images/menu/main-course/veg-korma.jpg",
  },
  {
    _id: "c3",
    name: "Fish Curry",
    category: "Main Course",
    price: 520,
    veg: false,
    vegan: false,
    dietary: false,
    description:
      "Traditional South Indian fish curry with kokum & coconut",
    image: "assets/images/menu/main-course/fish-curry.jpg",
  },
  {
    _id: "c4",
    name: "Paneer Butter Masala",
    category: "Main Course",
    price: 450,
    veg: true,
    vegan: false,
    dietary: false,
    description:
      "Silky paneer in a rich, buttery tomato-cream gravy",
    image: "assets/images/menu/main-course/paneer-butter-masala.jpg",
  },
  {
    _id: "c5",
    name: "Mutton Curry",
    category: "Main Course",
    price: 620,
    veg: false,
    vegan: false,
    dietary: false,
    description: "Slow-cooked mutton in a robust Chettinad-spiced curry",
    image: "assets/images/menu/main-course/mutton-curry.jpg",
  },
  {
    _id: "c6",
    name: "Prawn Masala",
    category: "Main Course",
    price: 580,
    veg: false,
    vegan: false,
    dietary: false,
    description: "Succulent prawns in a fiery coconut-tomato masala",
    image: "assets/images/menu/main-course/prawn-masala.jpg",
  },
  {
    _id: "c7",
    name: "Egg Curry",
    category: "Main Course",
    price: 320,
    veg: false,
    vegan: false,
    dietary: false,
    description: "Boiled eggs simmered in a spiced onion-tomato gravy",
    image: "assets/images/menu/main-course/egg-curry.jpg",
  },
  {
    _id: "c8",
    name: "Dal Tadka",
    category: "Main Course",
    price: 320,
    veg: true,
    vegan: true,
    dietary: true,
    description:
      "Yellow lentils tempered with mustard, dried red chillies & garlic",
    image: "assets/images/menu/main-course/dal-tadka.jpg",
  },
  {
    _id: "c9",
    name: "Sambar",
    category: "Main Course",
    price: 180,
    veg: true,
    vegan: true,
    dietary: true,
    description:
      "Classic South Indian lentil & vegetable stew with tamarind",
    image: "assets/images/menu/main-course/sambar.jpg",
  },
  {
    _id: "c10",
    name: "Chettinad Chicken",
    category: "Main Course",
    price: 580,
    veg: false,
    vegan: false,
    dietary: false,
    description:
      "Fiery Tamil Nadu dry curry with kalpasi & marathi mokku",
    image: "assets/images/menu/main-course/chettinad-chicken.jpg",
  },
  {
    _id: "c11",
    name: "Avial",
    category: "Main Course",
    price: 360,
    veg: true,
    vegan: false,
    dietary: true,
    description:
      "Mixed vegetables cooked in coconut-yoghurt sauce with curry leaves",
    image: "assets/images/menu/main-course/avial.jpg",
  },
  {
    _id: "c12",
    name: "Kootu",
    category: "Main Course",
    price: 330,
    veg: true,
    vegan: true,
    dietary: true,
    description:
      "Lentil & vegetable stew with freshly ground coconut masala",
    image: "assets/images/menu/main-course/kootu.jpg",
  },
  {
    _id: "c13",
    name: "Rasam",
    category: "Main Course",
    price: 160,
    veg: true,
    vegan: true,
    dietary: true,
    description:
      "Thin, tangy tamarind & tomato pepper broth — South India's soul",
    image: "assets/images/menu/main-course/rasam.jpg",
  },
  {
    _id: "c14",
    name: "Chicken Biryani",
    category: "Main Course",
    price: 480,
    veg: false,
    vegan: false,
    dietary: false,
    description:
      "Fragrant basmati layered with spiced chicken, saffron & fried onions",
    image: "assets/images/menu/main-course/biryani.jpg",
  },
  {
    _id: "c15",
    name: "Kara Kulambu",
    category: "Main Course",
    price: 380,
    veg: true,
    vegan: true,
    dietary: false,
    description:
      "Spicy tamarind-based gravy with shallots & sun-dried tomatoes",
    image: "assets/images/menu/main-course/kara-kulambu.jpg",
  },

  // ─────────────────────────────────────────────────────────────
  // DESSERTS (15)
  // ─────────────────────────────────────────────────────────────
  {
    _id: "d1",
    name: "Payasam",
    category: "Desserts",
    price: 180,
    veg: true,
    vegan: false,
    dietary: false,
    description:
      "Traditional Kerala rice & coconut milk pudding with cardamom",
    image: "assets/images/menu/desserts/payasam.jpg",
  },
  {
    _id: "d2",
    name: "Kesari",
    category: "Desserts",
    price: 150,
    veg: true,
    vegan: false,
    dietary: false,
    description:
      "Semolina & saffron halwa with cashews, raisins & ghee",
    image: "assets/images/menu/desserts/kesari.jpg",
  },
  {
    _id: "d3",
    name: "Gulab Jamun",
    category: "Desserts",
    price: 160,
    veg: true,
    vegan: false,
    dietary: false,
    description:
      "Soft milk-solid dumplings soaked in rose & cardamom syrup",
    image: "assets/images/menu/desserts/gulab-jamun.jpg",
  },
  {
    _id: "d4",
    name: "Coconut Ladoo",
    category: "Desserts",
    price: 140,
    veg: true,
    vegan: true,
    dietary: false,
    description:
      "Fresh grated coconut sweets rolled in desiccated coconut",
    image: "assets/images/menu/desserts/coconut-ladoo.jpg",
  },
  {
    _id: "d5",
    name: "Semiya Payasam",
    category: "Desserts",
    price: 170,
    veg: true,
    vegan: false,
    dietary: false,
    description:
      "Vermicelli milk pudding with saffron, cardamom & dry fruits",
    image: "assets/images/menu/desserts/semiya-payasam.jpg",
  },
  {
    _id: "d6",
    name: "Rasmalai",
    category: "Desserts",
    price: 200,
    veg: true,
    vegan: false,
    dietary: false,
    description:
      "Soft paneer discs soaked in chilled, saffron-infused sweetened milk",
    image: "assets/images/menu/desserts/rasmalai.jpg",
  },
  {
    _id: "d7",
    name: "Paal Kozhukattai",
    category: "Desserts",
    price: 160,
    veg: true,
    vegan: false,
    dietary: false,
    description:
      "Rice flour dumplings simmered in sweetened coconut milk",
    image: "assets/images/menu/desserts/paal-kozhukattai.jpg",
  },
  {
    _id: "d8",
    name: "Adhirasam",
    category: "Desserts",
    price: 130,
    veg: true,
    vegan: true,
    dietary: false,
    description: "Traditional Tamil deep-fried rice & jaggery sweet",
    image: "assets/images/menu/desserts/adhirasam.jpg",
  },
  {
    _id: "d9",
    name: "Sweet Pongal",
    category: "Desserts",
    price: 150,
    veg: true,
    vegan: false,
    dietary: false,
    description:
      "Auspicious rice & lentil sweet with jaggery, ghee & cardamom",
    image: "assets/images/menu/desserts/sweet-pongal.jpg",
  },
  {
    _id: "d10",
    name: "Badam Halwa",
    category: "Desserts",
    price: 220,
    veg: true,
    vegan: false,
    dietary: false,
    description:
      "Rich almond halwa simmered in ghee, saffron & milk",
    image: "assets/images/menu/desserts/badam-halwa.jpg",
  },
  {
    _id: "d11",
    name: "Jangiri",
    category: "Desserts",
    price: 140,
    veg: true,
    vegan: true,
    dietary: false,
    description: "Crispy urad dal spirals soaked in light sugar syrup",
    image: "assets/images/menu/desserts/jangiri.jpg",
  },
  {
    _id: "d12",
    name: "Murukku",
    category: "Desserts",
    price: 100,
    veg: true,
    vegan: true,
    dietary: false,
    description:
      "Crunchy spiral rice-lentil snack — a South Indian festival staple",
    image: "assets/images/menu/desserts/murukku.jpg",
  },
  {
    _id: "d13",
    name: "Mysore Pak",
    category: "Desserts",
    price: 160,
    veg: true,
    vegan: false,
    dietary: false,
    description:
      "Fudgy chickpea-flour sweet, loaded with ghee — a Mysore royal recipe",
    image: "assets/images/menu/desserts/mysore-pak.jpg",
  },
  {
    _id: "d14",
    name: "Kheer",
    category: "Desserts",
    price: 170,
    veg: true,
    vegan: false,
    dietary: false,
    description:
      "Slow-cooked rice pudding with full-cream milk, rose water & pistachios",
    image: "assets/images/menu/desserts/kheer.jpg",
  },
  {
    _id: "d15",
    name: "Kaju Katli",
    category: "Desserts",
    price: 180,
    veg: true,
    vegan: false,
    dietary: false,
    description:
      "Diamond-shaped cashew fudge with silver leaf — a festive classic",
    image: "assets/images/menu/desserts/kaju-katli.jpg",
  },

  // ─────────────────────────────────────────────────────────────
  // BEVERAGES (15)
  // ─────────────────────────────────────────────────────────────
  {
    _id: "e1",
    name: "Filter Coffee",
    category: "Beverages",
    price: 90,
    veg: true,
    vegan: false,
    dietary: false,
    description:
      "Authentic South Indian decoction coffee, frothy & aromatic",
    image: "assets/images/menu/beverages/filter-coffee.jpg",
  },
  {
    _id: "e2",
    name: "Masala Tea",
    category: "Beverages",
    price: 80,
    veg: true,
    vegan: false,
    dietary: false,
    description: "Spiced Indian chai with ginger, cardamom & tulsi",
    image: "assets/images/menu/beverages/masala-tea.jpg",
  },
  {
    _id: "e3",
    name: "Buttermilk",
    category: "Beverages",
    price: 70,
    veg: true,
    vegan: false,
    dietary: true,
    description:
      "Refreshing salted buttermilk with curry leaves & asafoetida",
    image: "assets/images/menu/beverages/buttermilk.jpg",
  },
  {
    _id: "e4",
    name: "Fresh Lime Soda",
    category: "Beverages",
    price: 90,
    veg: true,
    vegan: true,
    dietary: true,
    description:
      "Chilled fizzy lime refreshment — sweet, salted or masala",
    image: "assets/images/menu/beverages/fresh-lime.jpg",
  },
  {
    _id: "e5",
    name: "Mango Lassi",
    category: "Beverages",
    price: 130,
    veg: true,
    vegan: false,
    dietary: false,
    description:
      "Thick blended yoghurt drink with Alphonso mango pulp & cardamom",
    image: "assets/images/menu/beverages/mango-lassi.jpg",
  },
  {
    _id: "e6",
    name: "Rose Milk",
    category: "Beverages",
    price: 100,
    veg: true,
    vegan: false,
    dietary: false,
    description:
      "Chilled full-cream milk infused with rose syrup & basil seeds",
    image: "assets/images/menu/beverages/rose-milk.jpg",
  },
  {
    _id: "e7",
    name: "Tender Coconut",
    category: "Beverages",
    price: 120,
    veg: true,
    vegan: true,
    dietary: true,
    description:
      "Fresh tender coconut water served chilled with its soft malai",
    image: "assets/images/menu/beverages/tender-coconut.jpg",
  },
  {
    _id: "e8",
    name: "Badam Milk",
    category: "Beverages",
    price: 130,
    veg: true,
    vegan: false,
    dietary: false,
    description:
      "Warm or chilled almond-saffron milk with cardamom & pistachios",
    image: "assets/images/menu/beverages/badam-milk.jpg",
  },
  {
    _id: "e9",
    name: "Turmeric Latte",
    category: "Beverages",
    price: 120,
    veg: true,
    vegan: false,
    dietary: true,
    description:
      "Golden milk with turmeric, black pepper, ginger & honey",
    image: "assets/images/menu/beverages/turmeric-latte.jpg",
  },
  {
    _id: "e10",
    name: "Aam Panna",
    category: "Beverages",
    price: 100,
    veg: true,
    vegan: true,
    dietary: true,
    description:
      "Refreshing raw mango cooler with cumin, mint & black salt",
    image: "assets/images/menu/beverages/aam-panna.jpg",
  },
  {
    _id: "e11",
    name: "Sol Kadhi",
    category: "Beverages",
    price: 110,
    veg: true,
    vegan: true,
    dietary: true,
    description:
      "Kokum & coconut milk digestive drink from Konkan coast",
    image: "assets/images/menu/beverages/sol-kadhi.jpg",
  },
  {
    _id: "e12",
    name: "Nannari Sharbat",
    category: "Beverages",
    price: 100,
    veg: true,
    vegan: true,
    dietary: true,
    description:
      "Indian sarsaparilla root syrup drink with lemon — a summer classic",
    image: "assets/images/menu/beverages/nannari-sharbat.jpg",
  },
  {
    _id: "e13",
    name: "Sugarcane Juice",
    category: "Beverages",
    price: 90,
    veg: true,
    vegan: true,
    dietary: true,
    description: "Freshly pressed sugarcane juice with ginger & lemon",
    image: "assets/images/menu/beverages/sugarcane-juice.jpg",
  },
  {
    _id: "e14",
    name: "Tamarind Juice",
    category: "Beverages",
    price: 85,
    veg: true,
    vegan: true,
    dietary: true,
    description:
      "Tangy tamarind cooler with jaggery, jeera & black salt",
    image: "assets/images/menu/beverages/tamarind-juice.jpg",
  },
  {
    _id: "e15",
    name: "Panakam",
    category: "Beverages",
    price: 80,
    veg: true,
    vegan: true,
    dietary: true,
    description:
      "Sacred jaggery & ginger drink spiced with cardamom & dry ginger",
    image: "assets/images/menu/beverages/panakam.jpg",
  },
];

/* ─── Runner ─────────────────────────────────────────────────── */
async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅  Connected to MongoDB");

    await MenuItem.deleteMany({});
    console.log("🗑️   Cleared existing menu items");

    const inserted = await MenuItem.insertMany(menuItems);
    console.log(`🌱  Seeded ${inserted.length} menu items successfully`);

    const counts = menuItems.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});
    console.table(counts);
  } catch (err) {
    console.error("❌  Seed failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌  Disconnected");
  }
}

seed();