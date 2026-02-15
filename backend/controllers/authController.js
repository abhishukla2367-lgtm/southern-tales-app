const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Task 6: Loading history models for Profile page
let Order, Reservation;
try {
  Order = require("../models/Order");
  Reservation = require("../models/Reservation");
} catch (e) {
  console.warn("Order or Reservation models not found. Profile history may be empty.");
}

/**
 * @route   POST /api/auth/register
 * @desc    Task 5: Register User (No Username required)
 */
exports.register = async (req, res, next) => { 
  try {
    const { name, email, password, phone, address } = req.body;

    // 1. Check if user already exists (Standardize email to lowercase)
    const normalizedEmail = email.toLowerCase();
    const userExists = await User.findOne({ email: normalizedEmail }); 
    
    if (userExists) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // 2. Task 5: Password is hashed automatically by UserSchema.pre("save")
    await User.create({
      name,
      email: normalizedEmail,
      password, 
      phone,
      address,
    });

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error("❌ Registration Error:", err.message);
    next(err); 
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Task 3 & 5: Login with Email/Password and issue JWT
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // CRITICAL: .select("+password") overrides 'select: false' in the User Schema
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (user && (await user.matchPassword(password))) {
      // Task 3: Sign token with 1-day expiry
      const token = jwt.sign(
        { id: user._id, role: user.role || "user" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // Return user data (excluding password) and token
      res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role || "user",
          avatar: user.avatar
        },
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(500).json({ message: "Login failed" });
  }
};

/**
 * @route   GET /api/auth/profile
 * @desc    Task 6: Fetch Profile, My Orders, and My Reservations
 */
exports.getProfile = async (req, res) => {
  try {
    // Note: req.user comes from your verifyToken middleware
    const userId = req.user.id; 

    // 1. Fetch User details (password excluded by default in schema)
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Fetch history from MongoDB Atlas
    // IMPORTANT: Ensure your Order/Reservation schemas use "userId" or "user"
    const orders = Order ? await Order.find({ userId }).sort({ createdAt: -1 }) : [];
    const reservations = Reservation ? await Reservation.find({ userId }).sort({ date: -1 }) : [];

    res.json({
      user,
      orders,
      reservations,
    });
  } catch (err) {
    console.error("❌ Profile Fetch Error:", err.message);
    res.status(500).json({ message: "Failed to load profile" });
  }
};
