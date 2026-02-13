const router = require("express").Router();
const User = require("../models/User");
const Order = require("../models/Order");
const Reservation = require("../models/Reservation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Middleware: verifyToken
 * Task 4: Restricts specific actions like Reserving & Ordering.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Session expired. Please login again." });
      // Professional Fix: Standardize ID property for database queries
      req.user = decoded; 
      next();
    });
  } else {
    res.status(401).json({ message: "Access Denied: Please login to continue" });
  }
};

/**
 * @route   POST /api/auth/register
 * @desc    Task 5: Store user data in database (inc. Phone/Address)
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // 1. Validation
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    // 2. Task 5: Security - Password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Save to MongoDB Atlas
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,   
      address, 
      role: req.body.role || "user" // Default to user unless admin is specified
    });

    await newUser.save();
    res.status(201).json({ success: true, message: "Registration successful!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Registration failed: " + err.message });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Task 3: Navbar Toggle Logic & Task 5: Login via Email/Password
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user (Explicitly select password for comparison)
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    // 2. Compare passwords
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: "Invalid email or password" });

    // 3. Task 3 & 5: Create JWT (Used by frontend to toggle Profile icon)
    const token = jwt.sign(
      { id: user._id, role: user.role }, // Include role for Admin route protection
      process.env.JWT_SECRET,
      { expiresIn: "3d" }
    );

    // 4. Send clean user data
    const userObject = user.toObject();
    delete userObject.password;
    
    res.status(200).json({ ...userObject, token });
  } catch (err) {
    res.status(500).json({ message: "Login error: " + err.message });
  }
});

/**
 * @route   GET /api/auth/profile
 * @desc    Task 6: Show user details, My Orders, and My Reservations
 */
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Task 6: Fetch User + Orders + Reservations simultaneously
    const [user, orders, reservations] = await Promise.all([
      User.findById(userId).select("-password"),
      Order.find({ userId: userId }).sort({ createdAt: -1 }), // Ensure field name matches your Order schema
      Reservation.find({ userId: userId }).sort({ date: -1 }) // Ensure field name matches your Reservation schema
    ]);

    if (!user) return res.status(404).json({ message: "User profile not found" });

    res.status(200).json({
      user,          
      orders,        
      reservations   
    });
  } catch (err) {
    console.error("Profile Error:", err);
    res.status(500).json({ message: "Error retrieving profile data" });
  }
});

module.exports = router;
