const jwt = require("jsonwebtoken");

/**
 * PROTECT MIDDLEWARE (Task 4)
 * Ensures user is authenticated before: Reserving tables (Task 7) & Ordering food (Task 8).
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header: "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // 2. Verify token using secret from .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      /**
       * Task 6 & 8: Attach the user payload to the request object.
       * Ensure your Login/Register logic includes 'id' and 'role' in the JWT payload.
       */
      req.user = {
  _id: decoded.id || decoded._id, // Standardize to _id for MongoDB compatibility
  role: decoded.role,
  isAdmin: decoded.isAdmin
};

      next();
    } catch (error) {
      console.error("Token verification error:", error.message);
      // Task 3: Trigger frontend to clear storage and show Login button
      return res.status(401).json({ message: "Session expired. Please login again." });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }
};

/**
 * ADMIN MIDDLEWARE (Task 7 & 8.3)
 * Restricts access to Admin-side Reservation & Orders pages.
 * MUST be placed after 'protect' in the route chain.
 */
const admin = (req, res, next) => {
  // Check if req.user exists and has the admin role
  // We also check 'isAdmin' boolean in case your Schema uses that instead of 'role'
  if (req.user && (req.user.role === "admin" || req.user.isAdmin === true)) {
    next();
  } else {
    // 403 Forbidden: Authenticated but not authorized for this specific area
    res.status(403).json({ 
      message: "Access denied. This area requires Administrator privileges." 
    });
  }
};

module.exports = { protect, admin };
