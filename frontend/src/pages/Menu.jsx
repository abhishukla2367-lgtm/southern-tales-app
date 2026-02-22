import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

/* ================= HERO IMAGE IMPORTS ================= */
import southFoodHero  from "../assets/images/hero/south-food.jpg";
import southFoodHero2 from "../assets/images/hero/south-food2.jpg";
import southFoodHero3 from "../assets/images/hero/south-food3.jpg";

/* ================= BREAKFAST IMAGE IMPORTS ================= */
import plainDosa    from "../assets/images/menu/breakfast/plain-dosa.jpg";
import idli         from "../assets/images/menu/breakfast/idli.jpg";
import appam        from "../assets/images/menu/breakfast/appam.jpg";
import ravaDosa     from "../assets/images/menu/breakfast/rava-dosa.jpg";
import setDosa      from "../assets/images/menu/breakfast/set-dosa.jpg";
import meduVada     from "../assets/images/menu/breakfast/medu-vada.jpg";
import upma         from "../assets/images/menu/breakfast/upma.jpg";
import pongal       from "../assets/images/menu/breakfast/pongal.jpg";
import masalaDosa   from "../assets/images/menu/breakfast/masala-dosa.jpg";
import uttapam      from "../assets/images/menu/breakfast/uttapam.jpg";
import pesarattu    from "../assets/images/menu/breakfast/pesarattu.jpg";
import oothappam    from "../assets/images/menu/breakfast/oothappam.jpg";
import poha         from "../assets/images/menu/breakfast/poha.jpg";
import gheeRoastDosa from "../assets/images/menu/breakfast/ghee-roast-dosa.jpg";
import puttu        from "../assets/images/menu/breakfast/puttu.jpg";

/* ================= STARTERS IMAGE IMPORTS ================= */
import drumstickSoup  from "../assets/images/menu/starters/drumstick-soup.jpg";
import tomatoSoup     from "../assets/images/menu/starters/tomato-soup.jpg";
import prawnsRasam    from "../assets/images/menu/starters/prawns-rasam.jpg";
import broccoliTikka  from "../assets/images/menu/starters/broccoli-tikka.jpg";
import mushroomFry    from "../assets/images/menu/starters/mushroom-fry.jpg";
import eggRoast       from "../assets/images/menu/starters/egg-roast.jpg";
import pepperChicken  from "../assets/images/menu/starters/pepper-chicken.jpg";
import paneer65       from "../assets/images/menu/starters/paneer-65.jpg";
import chicken65      from "../assets/images/menu/starters/chicken-65.jpg";
import prawnFry       from "../assets/images/menu/starters/prawn-fry.jpg";
import fishTikka      from "../assets/images/menu/starters/fish-tikka.jpg";
import vegKebab       from "../assets/images/menu/starters/veg-kebab.jpg";
import cornCutlet     from "../assets/images/menu/starters/corn-cutlet.jpg";
import paneerTikka    from "../assets/images/menu/starters/paneer-tikka.jpg";
import mutton65       from "../assets/images/menu/starters/mutton-65.jpg";

/* ================= MAIN COURSE IMAGE IMPORTS ================= */
import chickenGheeRoast   from "../assets/images/menu/main-course/chicken-ghee-roast.jpg";
import vegKorma           from "../assets/images/menu/main-course/veg-korma.jpg";
import fishCurry          from "../assets/images/menu/main-course/fish-curry.jpg";
import paneerButterMasala from "../assets/images/menu/main-course/paneer-butter-masala.jpg";
import muttonCurry        from "../assets/images/menu/main-course/mutton-curry.jpg";
import prawnMasala        from "../assets/images/menu/main-course/prawn-masala.jpg";
import eggCurry           from "../assets/images/menu/main-course/egg-curry.jpg";
import dalTadka           from "../assets/images/menu/main-course/dal-tadka.jpg";
import sambar             from "../assets/images/menu/main-course/sambar.jpg";
import chettinadChicken   from "../assets/images/menu/main-course/chettinad-chicken.jpg";
import avial              from "../assets/images/menu/main-course/avial.jpg";
import kootu              from "../assets/images/menu/main-course/kootu.jpg";
import rasam              from "../assets/images/menu/main-course/rasam.jpg";
import biryani            from "../assets/images/menu/main-course/biryani.jpg";
import karaKulambu        from "../assets/images/menu/main-course/kara-kulambu.jpg";

/* ================= DESSERTS IMAGE IMPORTS ================= */
import payasam       from "../assets/images/menu/desserts/payasam.jpg";
import kesari        from "../assets/images/menu/desserts/kesari.jpg";
import gulabJamun    from "../assets/images/menu/desserts/gulab-jamun.jpg";
import coconutLadoo  from "../assets/images/menu/desserts/coconut-ladoo.jpg";
import semiyaPayasam from "../assets/images/menu/desserts/semiya-payasam.jpg";
import rasmalai      from "../assets/images/menu/desserts/rasmalai.jpg";
import paalKozhukattai from "../assets/images/menu/desserts/paal-kozhukattai.jpg";
import adhirasam     from "../assets/images/menu/desserts/adhirasam.jpg";
import sweetPongal   from "../assets/images/menu/desserts/sweet-pongal.jpg";
import bajjiHalwa    from "../assets/images/menu/desserts/badam-halwa.jpg";
import jangiri       from "../assets/images/menu/desserts/jangiri.jpg";
import murukku       from "../assets/images/menu/desserts/murukku.jpg";
import mysurePak     from "../assets/images/menu/desserts/mysore-pak.jpg";
import kheer         from "../assets/images/menu/desserts/kheer.jpg";
import kajuKatli     from "../assets/images/menu/desserts/kaju-katli.jpg";

/* ================= BEVERAGES IMAGE IMPORTS ================= */
import filterCoffee  from "../assets/images/menu/beverages/filter-coffee.jpg";
import masalaTea     from "../assets/images/menu/beverages/masala-tea.jpg";
import butterMilk    from "../assets/images/menu/beverages/buttermilk.jpg";
import freshLime     from "../assets/images/menu/beverages/fresh-lime.jpg";
import mangoLassi    from "../assets/images/menu/beverages/mango-lassi.jpg";
import roseMilk      from "../assets/images/menu/beverages/rose-milk.jpg";
import tenderCoconut from "../assets/images/menu/beverages/tender-coconut.jpg";
import badamMilk     from "../assets/images/menu/beverages/badam-milk.jpg";
import turmericLatte from "../assets/images/menu/beverages/turmeric-latte.jpg";
import aamPanna      from "../assets/images/menu/beverages/aam-panna.jpg";
import solKadhi      from "../assets/images/menu/beverages/sol-kadhi.jpg";
import nannari       from "../assets/images/menu/beverages/nannari-sharbat.jpg";
import sugarcane     from "../assets/images/menu/beverages/sugarcane-juice.jpg";
import tamarindJuice from "../assets/images/menu/beverages/tamarind-juice.jpg";
import panakam       from "../assets/images/menu/beverages/panakam.jpg";

/* ===============================================================
   MENU DATA  (veg / vegan / dietary flags)
   vegan  = true  → no animal products at all
   dietary = true → low-cal / health-conscious option
   =============================================================== */
const menuItems = [
  /* ── BREAKFAST (15) ─────────────────────────────────────────── */
  { _id:"a1",  name:"Plain Dosa",        category:"Breakfast",  price:165, veg:true,  vegan:true,  dietary:false, description:"Crispy golden rice crepe served with sambar & two chutneys", image:plainDosa },
  { _id:"a2",  name:"Idli (2 pcs)",      category:"Breakfast",  price:120, veg:true,  vegan:true,  dietary:true,  description:"Pillowy steamed rice cakes served with coconut chutney & sambar", image:idli },
  { _id:"a3",  name:"Appam (2 pcs)",     category:"Breakfast",  price:140, veg:true,  vegan:false, dietary:false, description:"Soft lacy Kerala rice pancakes — best with coconut milk stew", image:appam },
  { _id:"a4",  name:"Rava Dosa",         category:"Breakfast",  price:150, veg:true,  vegan:true,  dietary:false, description:"Thin, crispy semolina crepe with onion & green chilli", image:ravaDosa },
  { _id:"a5",  name:"Set Dosa",          category:"Breakfast",  price:160, veg:true,  vegan:true,  dietary:false, description:"Three soft spongy dosas served with sagu & chutney", image:setDosa },
  { _id:"a6",  name:"Medu Vada (2 pcs)", category:"Breakfast",  price:130, veg:true,  vegan:true,  dietary:false, description:"Crispy lentil fritters with a fluffy interior, served with sambar", image:meduVada },
  { _id:"a7",  name:"Upma",              category:"Breakfast",  price:120, veg:true,  vegan:false, dietary:true,  description:"Savoury semolina porridge tempered with mustard & curry leaves", image:upma },
  { _id:"a8",  name:"Pongal",            category:"Breakfast",  price:150, veg:true,  vegan:false, dietary:true,  description:"Comfort rice & lentil dish with black pepper & ghee", image:pongal },
  { _id:"a9",  name:"Masala Dosa",       category:"Breakfast",  price:185, veg:true,  vegan:true,  dietary:false, description:"Crispy dosa stuffed with spiced potato masala & onion", image:masalaDosa },
  { _id:"a10", name:"Uttapam",           category:"Breakfast",  price:155, veg:true,  vegan:true,  dietary:true,  description:"Thick rice pancake topped with onions, tomatoes & green chillies", image:uttapam },
  { _id:"a11", name:"Pesarattu",         category:"Breakfast",  price:145, veg:true,  vegan:true,  dietary:true,  description:"Green moong dal crepe from Andhra, high-protein & crispy", image:pesarattu },
  { _id:"a12", name:"Oothappam",         category:"Breakfast",  price:160, veg:true,  vegan:true,  dietary:false, description:"Thick fermented rice pancake topped with mixed veggies", image:oothappam },
  { _id:"a13", name:"Poha",              category:"Breakfast",  price:110, veg:true,  vegan:true,  dietary:true,  description:"Flattened rice stir-fried with turmeric, mustard & peanuts", image:poha },
  { _id:"a14", name:"Ghee Roast Dosa",   category:"Breakfast",  price:200, veg:true,  vegan:false, dietary:false, description:"Extra-crispy dosa slathered generously with clarified butter", image:gheeRoastDosa },
  { _id:"a15", name:"Puttu & Kadala",    category:"Breakfast",  price:175, veg:true,  vegan:true,  dietary:true,  description:"Steamed rice cylinders with coconut, served with spicy black chickpea curry", image:puttu },

  /* ── STARTERS (15) ──────────────────────────────────────────── */
  { _id:"b1",  name:"Drumstick Coriander Soup",  category:"Starters", price:325, veg:true,  vegan:true,  dietary:true,  description:"Earthy drumstick & coriander broth — a South Indian classic", image:drumstickSoup },
  { _id:"b2",  name:"Madras Tomato Soup",        category:"Starters", price:300, veg:true,  vegan:true,  dietary:true,  description:"Robustly spiced tomato soup tempered with South Indian spices", image:tomatoSoup },
  { _id:"b3",  name:"Prawns Rasam",              category:"Starters", price:450, veg:false, vegan:false, dietary:false, description:"Tangy prawn-infused rasam, light yet deeply flavourful", image:prawnsRasam },
  { _id:"b4",  name:"Broccoli Tikka",            category:"Starters", price:350, veg:true,  vegan:true,  dietary:true,  description:"Marinated broccoli florets, char-grilled in a tandoor", image:broccoliTikka },
  { _id:"b5",  name:"Kanthari Mushroom Fry",     category:"Starters", price:380, veg:true,  vegan:true,  dietary:true,  description:"Button mushrooms tossed with fiery bird's eye chillies", image:mushroomFry },
  { _id:"b6",  name:"Egg Roast",                 category:"Starters", price:280, veg:false, vegan:false, dietary:false, description:"Kerala-style boiled eggs roasted in spiced onion-tomato masala", image:eggRoast },
  { _id:"b7",  name:"Pepper Fried Chicken",      category:"Starters", price:450, veg:false, vegan:false, dietary:false, description:"Juicy chicken strips fried with cracked black pepper & curry leaves", image:pepperChicken },
  { _id:"b8",  name:"Paneer 65",                 category:"Starters", price:350, veg:true,  vegan:false, dietary:false, description:"Crispy deep-fried paneer cubes tossed in a fiery red sauce", image:paneer65 },
  { _id:"b9",  name:"Chicken 65",                category:"Starters", price:420, veg:false, vegan:false, dietary:false, description:"South Indian spiced deep-fried chicken — Hyderabad's signature starter", image:chicken65 },
  { _id:"b10", name:"Prawn Fry",                 category:"Starters", price:480, veg:false, vegan:false, dietary:false, description:"Jumbo prawns marinated in masala and shallow-fried to perfection", image:prawnFry },
  { _id:"b11", name:"Fish Tikka",                category:"Starters", price:460, veg:false, vegan:false, dietary:false, description:"Tender fish fillets marinated in coastal spices and grilled", image:fishTikka },
  { _id:"b12", name:"Veg Seekh Kebab",           category:"Starters", price:320, veg:true,  vegan:true,  dietary:true,  description:"Spiced vegetable & legume skewers, smoky off the grill", image:vegKebab },
  { _id:"b13", name:"Corn Cutlet",               category:"Starters", price:280, veg:true,  vegan:true,  dietary:true,  description:"Crispy sweet corn & potato cutlets with green chutney", image:cornCutlet },
  { _id:"b14", name:"Paneer Tikka",              category:"Starters", price:380, veg:true,  vegan:false, dietary:false, description:"Cubes of cottage cheese marinated in tandoori spices & grilled", image:paneerTikka },
  { _id:"b15", name:"Mutton 65",                 category:"Starters", price:520, veg:false, vegan:false, dietary:false, description:"Tender mutton pieces deep-fried with aromatic spices & curry leaves", image:mutton65 },

  /* ── MAIN COURSE (15) ───────────────────────────────────────── */
  { _id:"c1",  name:"Chicken Ghee Roast",    category:"Main Course", price:550, veg:false, vegan:false, dietary:false, description:"Iconic Mangalorean coastal chicken roasted in ghee & byadgi chillies", image:chickenGheeRoast },
  { _id:"c2",  name:"Vegetable Korma",       category:"Main Course", price:420, veg:true,  vegan:false, dietary:false, description:"Creamy mixed vegetable curry in a cashew & coconut sauce", image:vegKorma },
  { _id:"c3",  name:"Fish Curry",            category:"Main Course", price:520, veg:false, vegan:false, dietary:false, description:"Traditional South Indian fish curry with kokum & coconut", image:fishCurry },
  { _id:"c4",  name:"Paneer Butter Masala",  category:"Main Course", price:450, veg:true,  vegan:false, dietary:false, description:"Silky paneer in a rich, buttery tomato-cream gravy", image:paneerButterMasala },
  { _id:"c5",  name:"Mutton Curry",          category:"Main Course", price:620, veg:false, vegan:false, dietary:false, description:"Slow-cooked mutton in a robust Chettinad-spiced curry", image:muttonCurry },
  { _id:"c6",  name:"Prawn Masala",          category:"Main Course", price:580, veg:false, vegan:false, dietary:false, description:"Succulent prawns in a fiery coconut-tomato masala", image:prawnMasala },
  { _id:"c7",  name:"Egg Curry",             category:"Main Course", price:320, veg:false, vegan:false, dietary:false, description:"Boiled eggs simmered in a spiced onion-tomato gravy", image:eggCurry },
  { _id:"c8",  name:"Dal Tadka",             category:"Main Course", price:320, veg:true,  vegan:true,  dietary:true,  description:"Yellow lentils tempered with mustard, dried red chillies & garlic", image:dalTadka },
  { _id:"c9",  name:"Sambar",               category:"Main Course", price:180, veg:true,  vegan:true,  dietary:true,  description:"Classic South Indian lentil & vegetable stew with tamarind", image:sambar },
  { _id:"c10", name:"Chettinad Chicken",     category:"Main Course", price:580, veg:false, vegan:false, dietary:false, description:"Fiery Tamil Nadu dry curry with kalpasi & marathi mokku", image:chettinadChicken },
  { _id:"c11", name:"Avial",                category:"Main Course", price:360, veg:true,  vegan:false, dietary:true,  description:"Mixed vegetables cooked in coconut-yoghurt sauce with curry leaves", image:avial },
  { _id:"c12", name:"Kootu",               category:"Main Course", price:330, veg:true,  vegan:true,  dietary:true,  description:"Lentil & vegetable stew with freshly ground coconut masala", image:kootu },
  { _id:"c13", name:"Rasam",              category:"Main Course", price:160, veg:true,  vegan:true,  dietary:true,  description:"Thin, tangy tamarind & tomato pepper broth — South India's soul", image:rasam },
  { _id:"c14", name:"Chicken Biryani",       category:"Main Course", price:480, veg:false, vegan:false, dietary:false, description:"Fragrant basmati layered with spiced chicken, saffron & fried onions", image:biryani },
  { _id:"c15", name:"Kara Kulambu",          category:"Main Course", price:380, veg:true,  vegan:true,  dietary:false, description:"Spicy tamarind-based gravy with shallots & sun-dried tomatoes", image:karaKulambu },

  /* ── DESSERTS (15) ──────────────────────────────────────────── */
  { _id:"d1",  name:"Payasam",           category:"Desserts", price:180, veg:true,  vegan:false, dietary:false, description:"Traditional Kerala rice & coconut milk pudding with cardamom", image:payasam },
  { _id:"d2",  name:"Kesari",            category:"Desserts", price:150, veg:true,  vegan:false, dietary:false, description:"Semolina & saffron halwa with cashews, raisins & ghee", image:kesari },
  { _id:"d3",  name:"Gulab Jamun",       category:"Desserts", price:160, veg:true,  vegan:false, dietary:false, description:"Soft milk-solid dumplings soaked in rose & cardamom syrup", image:gulabJamun },
  { _id:"d4",  name:"Coconut Ladoo",     category:"Desserts", price:140, veg:true,  vegan:true,  dietary:false, description:"Fresh grated coconut sweets rolled in desiccated coconut", image:coconutLadoo },
  { _id:"d5",  name:"Semiya Payasam",    category:"Desserts", price:170, veg:true,  vegan:false, dietary:false, description:"Vermicelli milk pudding with saffron, cardamom & dry fruits", image:semiyaPayasam },
  { _id:"d6",  name:"Rasmalai",          category:"Desserts", price:200, veg:true,  vegan:false, dietary:false, description:"Soft paneer discs soaked in chilled, saffron-infused sweetened milk", image:rasmalai },
  { _id:"d7",  name:"Paal Kozhukattai", category:"Desserts", price:160, veg:true,  vegan:false, dietary:false, description:"Rice flour dumplings simmered in sweetened coconut milk", image:paalKozhukattai },
  { _id:"d8",  name:"Adhirasam",         category:"Desserts", price:130, veg:true,  vegan:true,  dietary:false, description:"Traditional Tamil deep-fried rice & jaggery sweet", image:adhirasam },
  { _id:"d9",  name:"Sweet Pongal",      category:"Desserts", price:150, veg:true,  vegan:false, dietary:false, description:"Auspicious rice & lentil sweet with jaggery, ghee & cardamom", image:sweetPongal },
  { _id:"d10", name:"Badam Halwa",       category:"Desserts", price:220, veg:true,  vegan:false, dietary:false, description:"Rich almond halwa simmered in ghee, saffron & milk", image:bajjiHalwa },
  { _id:"d11", name:"Jangiri",           category:"Desserts", price:140, veg:true,  vegan:true,  dietary:false, description:"Crispy urad dal spirals soaked in light sugar syrup", image:jangiri },
  { _id:"d12", name:"Murukku",           category:"Desserts", price:100, veg:true,  vegan:true,  dietary:false, description:"Crunchy spiral rice-lentil snack — a South Indian festival staple", image:murukku },
  { _id:"d13", name:"Mysore Pak",        category:"Desserts", price:160, veg:true,  vegan:false, dietary:false, description:"Fudgy chickpea-flour sweet, loaded with ghee — a Mysore royal recipe", image:mysurePak },
  { _id:"d14", name:"Kheer",             category:"Desserts", price:170, veg:true,  vegan:false, dietary:false, description:"Slow-cooked rice pudding with full-cream milk, rose water & pistachios", image:kheer },
  { _id:"d15", name:"Kaju Katli",        category:"Desserts", price:180, veg:true,  vegan:false, dietary:false, description:"Diamond-shaped cashew fudge with silver leaf — a festive classic", image:kajuKatli },

  /* ── BEVERAGES (15) ─────────────────────────────────────────── */
  { _id:"e1",  name:"Filter Coffee",     category:"Beverages", price:90,  veg:true,  vegan:false, dietary:false, description:"Authentic South Indian decoction coffee, frothy & aromatic", image:filterCoffee },
  { _id:"e2",  name:"Masala Tea",        category:"Beverages", price:80,  veg:true,  vegan:false, dietary:false, description:"Spiced Indian chai with ginger, cardamom & tulsi", image:masalaTea },
  { _id:"e3",  name:"Buttermilk",        category:"Beverages", price:70,  veg:true,  vegan:false, dietary:true,  description:"Refreshing salted buttermilk with curry leaves & asafoetida", image:butterMilk },
  { _id:"e4",  name:"Fresh Lime Soda",   category:"Beverages", price:90,  veg:true,  vegan:true,  dietary:true,  description:"Chilled fizzy lime refreshment — sweet, salted or masala", image:freshLime },
  { _id:"e5",  name:"Mango Lassi",       category:"Beverages", price:130, veg:true,  vegan:false, dietary:false, description:"Thick blended yoghurt drink with Alphonso mango pulp & cardamom", image:mangoLassi },
  { _id:"e6",  name:"Rose Milk",         category:"Beverages", price:100, veg:true,  vegan:false, dietary:false, description:"Chilled full-cream milk infused with rose syrup & basil seeds", image:roseMilk },
  { _id:"e7",  name:"Tender Coconut",    category:"Beverages", price:120, veg:true,  vegan:true,  dietary:true,  description:"Fresh tender coconut water served chilled with its soft malai", image:tenderCoconut },
  { _id:"e8",  name:"Badam Milk",        category:"Beverages", price:130, veg:true,  vegan:false, dietary:false, description:"Warm or chilled almond-saffron milk with cardamom & pistachios", image:badamMilk },
  { _id:"e9",  name:"Turmeric Latte",    category:"Beverages", price:120, veg:true,  vegan:false, dietary:true,  description:"Golden milk with turmeric, black pepper, ginger & honey", image:turmericLatte },
  { _id:"e10", name:"Aam Panna",         category:"Beverages", price:100, veg:true,  vegan:true,  dietary:true,  description:"Refreshing raw mango cooler with cumin, mint & black salt", image:aamPanna },
  { _id:"e11", name:"Sol Kadhi",         category:"Beverages", price:110, veg:true,  vegan:true,  dietary:true,  description:"Kokum & coconut milk digestive drink from Konkan coast", image:solKadhi },
  { _id:"e12", name:"Nannari Sharbat",   category:"Beverages", price:100, veg:true,  vegan:true,  dietary:true,  description:"Indian sarsaparilla root syrup drink with lemon — a summer classic", image:nannari },
  { _id:"e13", name:"Sugarcane Juice",   category:"Beverages", price:90,  veg:true,  vegan:true,  dietary:true,  description:"Freshly pressed sugarcane juice with ginger & lemon", image:sugarcane },
  { _id:"e14", name:"Tamarind Juice",    category:"Beverages", price:85,  veg:true,  vegan:true,  dietary:true,  description:"Tangy tamarind cooler with jaggery, jeera & black salt", image:tamarindJuice },
  { _id:"e15", name:"Panakam",           category:"Beverages", price:80,  veg:true,  vegan:true,  dietary:true,  description:"Sacred jaggery & ginger drink spiced with cardamom & dry ginger", image:panakam },
];

/* ─────────────────── FILTER CONFIG ─────────────────────── */
const CATEGORIES  = ["All","Breakfast","Starters","Main Course","Desserts","Beverages"];
const PRICE_RANGES = [
  { label:"All Prices",  value:"All"      },
  { label:"Under ₹200", value:"Under200"  },
  { label:"₹200 – ₹400",value:"200to400" },
  { label:"Above ₹400", value:"Above400"  },
];

/* Diet filter buttons — order matches user request */
const DIET_FILTERS = [
  { label:"All",     value:"All"     },
  { label:"● Veg",   value:"Veg"     },
  { label:"▲ Non-Veg",value:"NonVeg" },
  { label:"🌿 Vegan", value:"Vegan"  },
  { label:"🥗 Dietary",value:"Dietary"},
];

/* Accent colours per diet filter */
const DIET_COLOURS = {
  All:     { active:"#f5c27a", text:"#000" },
  Veg:     { active:"#4ade80", text:"#000" },
  NonVeg:  { active:"#f87171", text:"#000" },
  Vegan:   { active:"#34d399", text:"#000" },
  Dietary: { active:"#38bdf8", text:"#000" },
};

/* ═══════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════ */
export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const { addToCart }  = useCart();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm,        setSearchTerm]       = useState("");
  const [selectedDiet,      setSelectedDiet]     = useState("All");
  const [selectedPrice,     setSelectedPrice]    = useState("All");
  const [activeHero,        setActiveHero]       = useState(0);

  const heroImages = [southFoodHero, southFoodHero2, southFoodHero3];

  /* Hero auto-play */
  useEffect(() => {
    const t = setInterval(() => setActiveHero(p => (p + 1) % heroImages.length), 3200);
    return () => clearInterval(t);
  }, [heroImages.length]);

  /* Scroll to section from router state */
  useEffect(() => {
    if (location.state?.scrollToId) {
      const el = document.getElementById(location.state.scrollToId);
      if (el) el.scrollIntoView({ behavior:"smooth" });
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  /* Cart add w/ login guard */
  const handleAdd = (item) => {
    if (!isLoggedIn) {
      alert("Please login to start adding items to your cart");
      return navigate("/login");
    }
    addToCart(item);
  };

  /* ── Filter Logic ── */
  const filteredItems = menuItems.filter(item => {
    const catOk   = selectedCategory === "All" || item.category === selectedCategory;
    const srchOk  = item.name.toLowerCase().includes(searchTerm.toLowerCase());

    let dietOk = true;
    if (selectedDiet === "Veg")     dietOk = item.veg && !item.vegan;
    if (selectedDiet === "NonVeg")  dietOk = !item.veg;
    if (selectedDiet === "Vegan")   dietOk = item.vegan;
    if (selectedDiet === "Dietary") dietOk = item.dietary;

    const p = item.price;
    let priceOk = true;
    if (selectedPrice === "Under200")  priceOk = p < 200;
    if (selectedPrice === "200to400")  priceOk = p >= 200 && p <= 400;
    if (selectedPrice === "Above400")  priceOk = p > 400;

    return catOk && srchOk && dietOk && priceOk;
  });

  /* ════════════════════ RENDER ════════════════════ */
  return (
    <div className="bg-black min-h-screen text-white pb-20">

      {/* ══ 1. HERO ══════════════════════════════════════════════ */}
      <div className="relative h-[480px] w-full overflow-hidden border-b border-zinc-900">
        {heroImages.map((img, idx) => (
          <img
            key={idx}
            src={img}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              activeHero === idx ? "opacity-50" : "opacity-0"
            }`}
            alt="South Indian food hero"
          />
        ))}
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />

        {/* Slideshow dot indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveHero(i)}
              className="rounded-full border-0 cursor-pointer transition-all duration-300"
              style={{
                width:  activeHero === i ? 28 : 8,
                height: 8,
                background: activeHero === i ? "#f5c27a" : "rgba(255,255,255,0.3)",
              }}
            />
          ))}
        </div>

        {/* Hero text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <span className="text-[#f5c27a] font-black tracking-[0.3em] text-xs mb-4 uppercase">
            Authentic South Indian Flavours
          </span>
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-white mb-4">
            OUR MENU
          </h1>
          <div className="h-1.5 w-24 bg-[#f5c27a] rounded-full" />
        </div>
      </div>

      {/* ══ 2. FILTER PANEL ══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 mt-12 space-y-8">
        <div className="bg-[#0a0a0a] p-6 rounded-[2rem] border border-zinc-900 space-y-5">

          {/* Row 1: Search + Price dropdown */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative w-full md:w-1/3">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-base">🔍</span>
              <input
                type="text"
                placeholder="Search for a dish..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white focus:border-[#f5c27a] outline-none transition-all text-sm"
              />
            </div>

            {/* Price Filter */}
            <select
              value={selectedPrice}
              onChange={e => setSelectedPrice(e.target.value)}
              className="bg-black border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm font-semibold outline-none cursor-pointer focus:border-[#f5c27a] transition-all"
            >
              {PRICE_RANGES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>

            {/* Result count badge */}
            <span className="ml-auto text-zinc-600 text-xs font-bold tracking-wider uppercase">
              {filteredItems.length} dish{filteredItems.length !== 1 ? "es" : ""} found
            </span>
          </div>

          {/* Row 2: Diet filter buttons (All / Veg / Non-Veg / Vegan / Dietary) */}
          <div className="flex flex-wrap gap-2">
            {DIET_FILTERS.map(({ label, value }) => {
              const col     = DIET_COLOURS[value];
              const isActive = selectedDiet === value;
              return (
                <button
                  key={value}
                  onClick={() => setSelectedDiet(value)}
                  className="px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wide transition-all duration-200"
                  style={{
                    background:   isActive ? col.active : "transparent",
                    color:        isActive ? col.text   : "#666",
                    border:       `1px solid ${isActive ? col.active : "#2a2a2a"}`,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Row 3: Category tabs */}
          <div className="flex flex-wrap gap-2 border-t border-zinc-900 pt-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wide transition-all duration-200"
                style={{
                  background:   selectedCategory === cat ? "#f5c27a" : "transparent",
                  color:        selectedCategory === cat ? "#000"    : "#555",
                  border:       `1px solid ${selectedCategory === cat ? "#f5c27a" : "#2a2a2a"}`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ══ 3. DISH GRID ═══════════════════════════════════════ */}
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-zinc-700">
            <span className="text-5xl mb-4">🍽️</span>
            <p className="text-xl font-bold text-zinc-500">No dishes match your filters</p>
            <p className="text-sm mt-2 text-zinc-700">Try adjusting your search or filter selections</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredItems.map(item => (
              <DishCard key={item._id} item={item} onAdd={handleAdd} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   DISH CARD
   Key fix for equal-height Add to Cart buttons:
   • Card uses flex-col
   • Description uses flex-1 to fill all spare space
   • Footer is always at the bottom — no matter how long the text
══════════════════════════════════════════════════════════════ */
function DishCard({ item, onAdd }) {
  const [flash, setFlash] = useState(false);

  const handleClick = () => {
    onAdd(item);
    setFlash(true);
    setTimeout(() => setFlash(false), 600);
  };

  /* Diet badge config */
  const badges = [];
  if (item.vegan)   badges.push({ label:"🌿 Vegan",   color:"#34d399", bg:"rgba(52,211,153,0.12)" });
  else if (item.veg)badges.push({ label:"● Veg",      color:"#4ade80", bg:"rgba(74,222,128,0.12)" });
  else              badges.push({ label:"▲ Non-Veg",  color:"#f87171", bg:"rgba(248,113,113,0.12)" });
  if (item.dietary) badges.push({ label:"🥗 Dietary", color:"#38bdf8", bg:"rgba(56,189,248,0.12)" });

  return (
    <div
      className="flex flex-col h-full bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden border border-zinc-900 transition-all duration-400 shadow-2xl group"
      style={{ transition:"border-color 0.4s, transform 0.35s, box-shadow 0.4s" }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor  = "rgba(245,194,122,0.35)";
        e.currentTarget.style.transform    = "translateY(-5px)";
        e.currentTarget.style.boxShadow    = "0 24px 60px rgba(245,194,122,0.10)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor  = "rgb(39 39 42)";
        e.currentTarget.style.transform    = "translateY(0)";
        e.currentTarget.style.boxShadow    = "";
      }}
    >
      {/* ── Image ── */}
      <div className="relative h-52 overflow-hidden flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Dark gradient so badges are readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Diet badges — top right */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
          {badges.map(b => (
            <span
              key={b.label}
              className="px-2.5 py-0.5 rounded-full text-[10px] font-black"
              style={{
                border: `1px solid ${b.color}55`,
                background: b.bg,
                color: b.color,
                letterSpacing:"0.04em",
              }}
            >
              {b.label}
            </span>
          ))}
        </div>

        {/* Category chip — bottom left */}
        <span
          className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest"
          style={{ background:"rgba(0,0,0,0.65)", color:"#f5c27a", backdropFilter:"blur(6px)" }}
        >
          {item.category}
        </span>
      </div>

      {/* ── Body (flex-1 makes all cards stretch equally tall) ── */}
      <div className="flex flex-col flex-1 p-6">
        {/* Name */}
        <h3 className="text-[1.05rem] font-bold text-white mb-2 leading-snug">
          {item.name}
        </h3>

        {/* Description — flex-1 pushes footer to bottom */}
        <p className="text-zinc-500 text-[0.8rem] leading-relaxed flex-1">
          {item.description}
        </p>

        {/* ── Footer — always at the SAME vertical position ── */}
        <div className="flex justify-between items-center mt-5 pt-4 border-t border-zinc-900">
          {/* Price */}
          <div>
            <span className="block text-[9px] text-zinc-600 uppercase font-bold tracking-[0.15em] mb-0.5">
              Price
            </span>
            <span className="text-2xl font-black text-white leading-none">
              ₹{item.price}
            </span>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleClick}
            className="text-[11px] font-black uppercase tracking-wide px-5 py-3 rounded-2xl transition-all duration-250 active:scale-90"
            style={{
              background:   flash ? "#ffffff" : "#f5c27a",
              color:        "#000",
              boxShadow:    "0 10px 24px -10px rgba(245,194,122,0.45)",
              transform:    flash ? "scale(0.92)" : "scale(1)",
              letterSpacing:"0.06em",
            }}
          >
            {flash ? "✓ Added" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}