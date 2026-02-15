require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("node:dns");

// Professional Fix: Prevents "ENOTFOUND" errors when connecting to MongoDB Atlas 
// in certain local development environments (Requirement #2)
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

// --- 1. MIDDLEWARE CONFIGURATION ---

// Task 1: Ensure professional and consistent cross-origin communication
app.use(cors({
  origin: process.env.CLIENT_URL || ["http://localhost:5173", "http://localhost:5174"], 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Task 5 & 8: Essential for parsing JSON data for Register, Login, and Cart
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Professional Logging: Helps track Task 4 & 7 access attempts in real-time
app.use((req, res, next) => {
  console.log(`📩 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- 2. DATABASE CONNECTION (Task 2) ---

// Connects to MongoDB Atlas using the URI stored in your .env file
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas: Connection Established Successfully."))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    // Task 2: Critical failure - stop server if database is unreachable
    process.exit(1); 
  });

// --- 3. ROUTE MOUNTING ---

// Requirement #5 & 6: Authentication and User Profile
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes); 

// Requirement #8: Cart operations (Add, Delete, and Get Cart)
const cartRoutes = require("./routes/cartRoutes");
app.use("/api/cart", cartRoutes);

// Add this in Section 3 (Route Mounting)
const menuRoutes = require("./routes/menuRoutes"); 
app.use("/api/menu", menuRoutes); 


// Requirement #8.1 & 8.2: Order placement and clearing cart
const orderRoutes = require("./routes/orderRoutes"); 
app.use("/api/orders", orderRoutes); 

// Requirement #7: Table Reservations
const reservationRoutes = require("./routes/reservationRoutes");
app.use("/api/reservations", reservationRoutes);

// Requirement #7 & 8.3: Admin Dashboard (Reservations & Orders)
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

// --- 4. UTILITY ROUTES ---

// Health Check: Verification for Task 2 & Server Status
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "Active", 
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected" 
  });
});

// --- 5. GLOBAL ERROR HANDLING ---

// Professional Requirement: Ensure the server doesn't crash on bad requests
app.use((err, req, res, next) => {
  console.error("🔥 Server Error Stack:", err.stack);
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || "Internal Server Error",
    // Only show detailed errors in development mode
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});

// --- 6. START SERVER ---

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server successfully deployed on port ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
});
