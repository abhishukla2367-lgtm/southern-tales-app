require("dotenv").config();
const express    = require("express");
const mongoose   = require("mongoose");
const cors       = require("cors");
const dns        = require("node:dns");
const http       = require("http");
const { Server } = require("socket.io");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app    = express();
const server = http.createServer(app); // ← wrap express in http server

// ── Socket.io setup ──────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Make io accessible in all route files via req.app.get("io")
app.set("io", io);

io.on("connection", (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);
  socket.on("disconnect", () => console.log(`🔌 Socket disconnected: ${socket.id}`));
});

// --- 1. MIDDLEWARE CONFIGURATION ---

app.use(cors({
  origin: process.env.CLIENT_URL || ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "10mb" }));

// ✅ Skip urlencoded parsing for multipart/form-data requests (let multer handle those)
app.use((req, res, next) => {
  if (req.is("multipart/form-data")) return next();
  express.urlencoded({ extended: true })(req, res, next);
});

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

// --- 3. ROUTES ---

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

// ── New routes for Live Orders feature ──────────────────────────────────────
const walkinRoutes = require("./routes/walkinRoutes");
app.use("/api/walkin", walkinRoutes);

const billRoutes = require("./routes/billRoutes");
app.use("/api/bill", billRoutes);

const tableRoutes = require("./routes/tableRoutes");
app.use("/api/tables", tableRoutes);
// ─────────────────────────────────────────────────────────────────────────────

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "Active",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

// --- 4. GLOBAL ERROR HANDLING ---

app.use((err, req, res, next) => {
  console.error("🔥 Server Error Stack:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// --- 5. START SERVER --- (use `server.listen` not `app.listen`)

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server successfully deployed on port ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🔌 Socket.io: ready`);
});