const router = require("express").Router();
const User = require("../models/User");
const Order = require("../models/Order"); 
const Reservation = require("../models/Reservation");
const jwt = require("jsonwebtoken");

// Task 4: Middleware to verify user session
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1]; 
    jwt.verify(token, process.env.JWT_SEC, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid or expired token" });
      req.user = decoded; 
      next();
    });
  } else {
    res.status(401).json({ message: "Access Denied: No token provided" });
  }
};

/**
 * @route   POST /api/auth/register
 */
router.post("/register", async (req, res) => {
  try {
    const { email, name, password, phone, address } = req.body;
    
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    // REMOVED manual bcrypt.hash from here. 
    // The User Model pre-save hook handles it!
    const newUser = new User({ 
      name,
      email: email.toLowerCase(),
      password, // Send plain text to the model
      phone,
      address
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   POST /api/auth/login
 */
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() }).select("+password");
    
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Task 5: Use the method from the User Model to compare
    const isMatch = await user.matchPassword(req.body.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role || "user" },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const userObject = user.toObject();
    delete userObject.password;

    res.status(200).json({ ...userObject, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   GET /api/auth/profile
 */
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Task 6: Fetch combined history
    const [orders, reservations] = await Promise.all([
      Order.find({ userId: req.user.id }).sort({ createdAt: -1 }),
      Reservation.find({ userId: req.user.id }).sort({ date: -1 })
    ]);

    res.status(200).json({ user, orders, reservations });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
