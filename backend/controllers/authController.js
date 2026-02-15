const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Task 6: Loading history models for Profile page
let Order, Reservation;
try {
  // Use path-appropriate requires for your project structure
  Order = require("../models/Order");
  Reservation = require("../models/Reservation");
} catch (e) {
  console.warn("⚠️ Order or Reservation models not found. Profile history will be empty.");
}

/**
 * @route   POST /api/auth/register
 * @desc    Task 5: User Registration
 */
exports.register = async (req, res) => { 
  try {
    const { name, email, password, phone, address } = req.body;

    // Validation: Prevents 400 Bad Request if frontend sends empty data
    if (!name || !email || !password || !phone || !address) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required (Name, Email, Password, Phone, Address)" 
      });
    }

    const normalizedEmail = email.toLowerCase();
    
    // 1. Check if user already exists
    const userExists = await User.findOne({ email: normalizedEmail }); 
    if (userExists) {
      return res.status(400).json({ success: false, message: "Email is already registered" });
    }

    // 2. Create User (Password is hashed by UserSchema pre-save)
    await User.create({
      name,
      email: normalizedEmail,
      password, 
      phone,
      address,
    });

    res.status(201).json({ 
      success: true,
      message: "Registration successful! You can now log in." 
    });
  } catch (err) {
    console.error("❌ Registration Error:", err.message);
    res.status(500).json({ success: false, message: "Registration failed", error: err.message });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Task 3 & 5: Login with Email/Password and issue JWT
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide both email and password" });
    }
    
    // Explicitly select password since 'select: false' is used in the User Model
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (user && (await user.matchPassword(password))) {
      // Create JWT Token
      const token = jwt.sign(
        { id: user._id, role: user.role || "user" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role || "user",
          avatar: user.avatar,
          phone: user.phone,
          address: user.address
        },
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(500).json({ success: false, message: "Login server error" });
  }
};

/**
 * @route   GET /api/auth/profile
 * @desc    Task 6: Fetch Profile, My Orders, and My Reservations
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assigned by your auth middleware

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Task 6: Fetch related data if models are available
    let orders = [];
    let reservations = [];

    if (Order) {
      orders = await Order.find({ userId: userId }).sort({ createdAt: -1 });
    }
    
    if (Reservation) {
      reservations = await Reservation.find({ userId: userId }).sort({ date: -1 });
    }

    res.status(200).json({
      success: true,
      user,
      orders,
      reservations,
    });
  } catch (err) {
    console.error("❌ Profile Fetch Error:", err.message);
    res.status(500).json({ 
      success: false, 
      message: "Failed to load profile data", 
      error: err.message 
    });
  }
};
