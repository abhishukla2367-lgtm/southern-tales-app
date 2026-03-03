// server/socket.js
// ✅ Fix — remove `const` so it assigns to outer `let io`
const { Server } = require("socket.io");
let io;

const initSocket = (server) => {
  io = new Server(server, { // ← no const/let — assigns to outer io ✅
    cors: {
      origin: process.env.CLIENT_URL || ["http://localhost:5173", "http://localhost:5174"],
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 300000,
    pingInterval: 60000,
    allowUpgrades: false,
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    socket.on("join_order_room", (orderId) => {
      socket.join(`order_${orderId}`);
      console.log(`📦 Socket ${socket.id} joined order_${orderId}`);
    });

    socket.on("leave_order_room", (orderId) => {
      socket.leave(`order_${orderId}`);
      console.log(`📦 Socket ${socket.id} left order_${orderId}`);
    });

    socket.on("join_reservation_room", (reservationId) => {
      socket.join(`reservation_${reservationId}`);
      console.log(`🍽️ Socket ${socket.id} joined reservation_${reservationId}`);
    });

    socket.on("leave_reservation_room", (reservationId) => {
      socket.leave(`reservation_${reservationId}`);
      console.log(`🍽️ Socket ${socket.id} left reservation_${reservationId}`);
    });

    // server/socket.js
socket.on("join_tables_room", () => {
  // ✅ Only join if not already in the room
  if (!socket.rooms.has("tables_room")) {
    socket.join("tables_room");
    console.log(`🪑 Socket ${socket.id} joined tables_room`);
  }
});

    socket.on("disconnect", (reason) => {
      console.log(`🔌 Socket disconnected: ${socket.id} | Reason: ${reason}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("❌ Socket.io not initialized! Call initSocket(server) first.");
  return io;
};

module.exports = { initSocket, getIO };