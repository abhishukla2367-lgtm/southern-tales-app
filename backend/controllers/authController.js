const User = require('../models/User'); 
const Order = require('../models/Order'); // Required for Task 6.2
const Reservation = require('../models/Reservation'); // Required for Task 6.2 & 7
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. Register User (Requirement #5)
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already registered" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Store user data in database
        const newUser = await User.create({ 
            name, 
            email, 
            password: hashedPassword,
            phone,
            address
        });

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// 2. Login User (Requirement #5 & #6)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await User.findOne({ email });

        if (user && await bcrypt.compare(password, user.password)) {
            // Generate JWT (Include ID and Role)
            const token = jwt.sign(
                { id: user._id, role: user.role || 'user' }, 
                process.env.JWT_SECRET, 
                { expiresIn: '1d' }
            );

            // Return token and user details for local storage/state
            res.json({ 
                token, 
                user: { 
                    id: user._id, 
                    name: user.name, 
                    email: user.email,
                    role: user.role 
                } 
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 3. Get Full Profile (Requirement #6: User + Orders + Reservations)
exports.getProfile = async (req, res) => {
    try {
        // req.user.id is populated by your authMiddleware from the JWT
        const userId = req.user.id;

        // Fetch User details (excluding password)
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Requirement #6: Fetch user-specific orders
        // Ensure your Order model uses "userId" as the field name
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });

        // Requirement #6 & #7: Fetch user-specific reservations
        // Ensure your Reservation model uses "userId" as the field name
        const reservations = await Reservation.find({ userId }).sort({ date: -1 });

        // Send consolidated response to the Profile frontend component
        res.json({ 
            user, 
            orders, 
            reservations 
        });

    } catch (err) {
        console.error("Profile Fetch Error:", err);
        res.status(500).json({ error: "Failed to fetch profile data" });
    }
};
