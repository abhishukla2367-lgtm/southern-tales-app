import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const createSocket = () => io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  pingTimeout: 300000,     // ✅ 5 minutes — handles tab throttling
  pingInterval: 60000,     // ✅ ping every 60s
  transports: ["websocket"],
  upgrade: false,
});

const socket = globalThis._socket ?? createSocket();
if (!globalThis._socket) globalThis._socket = socket;

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    socket.disconnect();
    delete globalThis._socket;
  });
}

socket.on("connect",           () => console.log("🔌 Socket connected:", socket.id));
socket.on("disconnect",        (reason) => console.warn("⚠️ Disconnected:", reason));
socket.on("connect_error",     (e) => console.warn("❌ Socket error:", e.message));
socket.on("reconnect",         (n) => console.log(`🔄 Reconnected after ${n} attempts`));
socket.on("reconnect_attempt", (n) => console.log(`🔁 Attempt #${n}`));

if (!socket.connected) socket.connect();

export default socket;