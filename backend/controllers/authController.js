const User = require("../models/User");
const Order = require("../models/Order");
const Reservation = require("../models/Reservation");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

/**
 * @desc    Register new user
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

    await User.create({
      name,
      email: normalizedEmail,
      password, // Password hashing should be handled in User Model Middleware
      phone,
      address,
    });

    res.status(201).json({ success: true, message: "Registration successful!" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Registration failed", error: err.message });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (user && (await user.matchPassword(password))) {
      const token = jwt.sign(
       { id: user._id, role: user.role || "user", isAdmin: user.role === "admin" },
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
 * @desc    Requirement #6: Get user profile with Orders and Reservations
 * @route   GET /api/auth/profile
 * @access  Private
 */
exports.getProfile = async (req, res) => {
  try {
    // 1. Get current logged-in user ID from token (provided by your auth middleware)
    const currentId = req.user.id; 
    const objectId = new mongoose.Types.ObjectId(currentId);

    // 2. Fetch all three in parallel for better performance
    const [user, orders, reservations] = await Promise.all([
      User.findById(objectId).select("-password"),
      
      // ✅ UPDATED: Now matches your new Schema field 'userId'
      Order.find({ userId: objectId }).sort({ createdAt: -1 }), 

      // Matches 'userId' field in your Reservations
      Reservation.find({ userId: objectId }).sort({ date: -1 })
    ]);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 3. LOG TO SERVER CONSOLE: Check this in your terminal to verify data is coming through
    console.log(`✅ Profile Sync: ${user.email}`);
    console.log(`📊 Stats -> Orders found: ${orders.length} | Reservations found: ${reservations.length}`);

    res.status(200).json({
      success: true,
      user,
      orders, // This will now correctly contain the user's orders
      reservations
    });
  } catch (err) {
    console.error("Profile Fetch Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};