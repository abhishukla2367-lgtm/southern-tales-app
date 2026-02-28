// src/socket.js
// ─────────────────────────────────────────────────────────────────────────────
// Singleton Socket.io client — import this anywhere in the frontend.
// Usage:
//   import socket from "../socket";
//   socket.on("tables:updated", ({ tables }) => { ... });
// ─────────────────────────────────────────────────────────────────────────────
import { io } from "socket.io-client";
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||   // set in your .env: VITE_SOCKET_URL=http://localhost:5000
  import.meta.env.VITE_API_URL    ||
  "http://localhost:5000";
const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
});
socket.on("connect",         () => console.log("🔌 Socket connected:", socket.id));
socket.on("disconnect",      ()  => console.log("🔌 Socket disconnected"));
socket.on("connect_error",   (e) => console.warn("🔌 Socket error:", e.message));
export default socket; 