const router = require("express").Router();
const User = require("../models/User");
const Order = require("../models/Order"); 
const Reservation = require("../models/Reservation");
const jwt = require("jsonwebtoken");

// Use a consistent secret key name from your .env file
const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_SEC;

/**
 * Task 4: Middleware to verify user session
 * Protects routes like /profile, /reservations, and /orders
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1]; 

    // Error Prevention: Ensure the secret exists before verifying
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
 * @route   POST /api/auth/register
 */
router.post("/register", async (req, res) => {
  try {
    const { email, name, password, phone, address } = req.body;
    
    // Normalize email to prevent duplicate accounts with different casing
    const normalizedEmail = email.trim().toLowerCase();
    
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    const newUser = new User({ 
      name,
      email: normalizedEmail,
      password, // Handled by pre-save hook in User Model
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
 * @route   POST /api/auth/login
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email and password" });
    }

    // Find user and explicitly select password for comparison
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
    
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare hashed password using the User Model method
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Task 5: Generate JWT Token
    if (!JWT_SECRET) {
      return res.status(500).json({ message: "Server Error: secretOrPrivateKey must have a value in .env" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role || "user" },
      JWT_SECRET,
      { expiresIn: "3d" }
    );

    // Prepare user object for frontend (excluding password)
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
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Task 6: Fetch combined history for Orders and Reservations
    const [orders, reservations] = await Promise.all([
      Order.find({ userId: req.user.id }).sort({ createdAt: -1 }),
      Reservation.find({ userId: req.user.id }).sort({ date: -1 })
    ]);

    res.status(200).json({ user, orders, reservations });
  } catch (err) {
    console.error("Profile Fetch Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
