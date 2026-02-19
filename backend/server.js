require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("node:dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

// --- 1. MIDDLEWARE CONFIGURATION ---

app.use(cors({
  origin: process.env.CLIENT_URL || ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // FIX: Added PATCH for menu toggleAvailability
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`📩 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// --- 2. DATABASE CONNECTION ---

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas: Connection Established Successfully."))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

const otpRoutes = require("./routes/otpRoutes");
app.use("/api/otp", otpRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const cartRoutes = require("./routes/cartRoutes");
app.use("/api/cart", cartRoutes);


const menuRoutes = require("./routes/menuRoutes");
app.use("/api/menu", menuRoutes);

const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);


const reservationRoutes = require("./routes/reservationRoutes");
app.use("/api/reservations", reservationRoutes);


const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);


const reportRoutes = require("./routes/reportRoutes");
app.use("/api/reports", reportRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "Active",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// --- 5. GLOBAL ERROR HANDLING ---

app.use((err, req, res, next) => {
  console.error("🔥 Server Error Stack:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : {}
  });
});

// --- 6. START SERVER ---

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server successfully deployed on port ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
});