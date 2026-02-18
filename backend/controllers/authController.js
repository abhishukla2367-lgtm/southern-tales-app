const User = require("../models/User");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// 🛠️ FIX: Direct imports are safer. If these fail, the server will tell you exactly why (Path error).
const Order = require("../models/Order"); 
const Reservation = require("../models/Reservation");

/**
 * @route   POST /api/auth/register
 */
exports.register = async (req, res) => { 
  try {
    const { name, email, password, phone, address } = req.body;

    if (!name || !email || !password || !phone || !address) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const normalizedEmail = email.toLowerCase();
    const userExists = await User.findOne({ email: normalizedEmail }); 
    if (userExists) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    await User.create({ name, email: normalizedEmail, password, phone, address });

    res.status(201).json({ success: true, message: "Registration successful!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Registration failed", error: err.message });
  }
};

/**
 * @route   POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign(
        { id: user._id, role: user.role || "user" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(200).json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Login server error" });
  }
};

/**
 * @route   GET /api/auth/profile
 */
exports.getProfile = async (req, res) => {
  try {
    // 🛡️ Middleware Check: Ensure req.user exists from your authMiddleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Not authorized, no ID found" });
    }

    const userId = req.user.id; 

    // 1. Fetch User
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // 2. Fetch Orders & Reservations 
    // 💡 IMPORTANT: Ensure your OrderSchema has a field named 'user' that stores the ID
    const [orders, reservations] = await Promise.all([
      Order.find({ user: userId }).sort({ createdAt: -1 }),
      Reservation.find({ user: userId }).sort({ date: -1 })
    ]);

    // 3. Final Response
    res.status(200).json({
      success: true,
      user,
      orders,
      reservations,
    });
  } catch (err) {
    console.error("❌ Profile Fetch Error:", err);
    res.status(500).json({ success: false, message: "Failed to load profile", error: err.message });
  }
};
