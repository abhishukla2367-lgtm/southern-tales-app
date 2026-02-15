import axios from "axios";

const API = axios.create({
  // FIX: Use relative path so the Vite proxy can catch it
  baseURL: "/api", 
  headers: { "Content-Type": "application/json"}
});

/**
 * REQUEST INTERCEPTOR (Task 4 & 5)
 * Attaches JWT for protected routes (Reservation & Ordering)
 */
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Standard Bearer format
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR (Requirement #3 & #4)
 * Handles session expiration and automatic logout
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401: Unauthorized (Expired/Invalid Token)
    if (error.response && error.response.status === 401) {
      console.warn("Session expired. Logging out...");
      
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect only if not on public pages
      if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;
