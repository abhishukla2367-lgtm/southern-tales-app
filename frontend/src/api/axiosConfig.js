import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

/**
 * REQUEST INTERCEPTOR
 * - Attaches JWT for protected routes
 * - Removes Content-Type for FormData so browser sets multipart/form-data + boundary automatically
 */
API.interceptors.request.use(
  (config) => {
    // ── JWT ───────────────────────────────────────────────────────────────
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ── FormData fix ──────────────────────────────────────────────────────
    // When the body is FormData, delete the Content-Type header entirely.
    // The browser will then set it automatically as:
    //   multipart/form-data; boundary=----WebKitFormBoundary...
    // If we leave "application/json" here, the backend can't parse the body → 400.
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 * Handles session expiration and automatic logout
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Session expired. Logging out...");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login" && window.location.pathname !== "/") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default API;