const router = require("express").Router();
const User = require("../models/User");
const Order = require("../models/Order"); 
const Reservation = require("../models/Reservation");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose"); // Added for ObjectId casting

// Use a consistent secret key name from your .env file
const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_SEC;

/**
 * Task 4: Middleware to verify user session
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1]; 

    if (!JWT_SECRET) {
      return res.status(500).json({ message: "Server Configuration Error: JWT Secret is missing." });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid or expired token" });
      req.user = decoded; 
      next();
    });
  } else {
    res.status(401).json({ message: "Access Denied: No token provided" });
  }
};

/**
 * Task 5: Register User
 */
router.post("/register", async (req, res) => {
  try {
    const { email, name, password, phone, address } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    const newUser = new User({ 
      name,
      email: normalizedEmail,
      password, 
      phone,
      address
    });

    await newUser.save();
    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Task 5: Login User
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
    
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role || "user" },
      JWT_SECRET,
      { expiresIn: "1d" } // Changed to 1d for standard internship practice
    );

    const userObject = user.toObject();
    delete userObject.password;

    res.status(200).json({ user: userObject, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Task 6: User Profile with History
 * @route   GET /api/auth/profile
 */
router.get("/profile", verifyToken, async (req, res) => {
  try {
    // 1. Convert the string ID from the token to a MongoDB ObjectId
    const currentUserId = new mongoose.Types.ObjectId(req.user.id);

    const user = await User.findById(currentUserId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Task 6: Fetch history using the new 'userId' key
    const [orders, reservations] = await Promise.all([
      // ✅ Corrected: Querying by 'userId'
      Order.find({ userId: currentUserId }).sort({ createdAt: -1 }),
      
      // ✅ Corrected: Querying by 'userId' for Reservations
      Reservation.find({ userId: currentUserId }).sort({ date: -1 })
    ]);

    // 3. Log results for easier debugging in your terminal
    console.log(`📊 Profile Sync [${user.email}]: Orders(${orders.length}) Res(${reservations.length})`);

    res.status(200).json({ 
      success: true,
      user, 
      orders, 
      reservations 
    });
  } catch (err) {
    console.error("❌ Profile Fetch Error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;