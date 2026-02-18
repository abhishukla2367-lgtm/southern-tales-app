const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ FIX: Attach both 'id' and '_id' to prevent undefined errors in controllers
      const userId = decoded.id || decoded._id;
      
      req.user = {
        id: userId,        // For your Controller queries
        _id: userId,       // For MongoDB compatibility
        role: decoded.role,
        isAdmin: decoded.isAdmin
      };

      return next(); // Use return to stop execution here
    } catch (error) {
      console.error("Token verification error:", error.message);
      return res.status(401).json({ message: "Session expired. Please login again." });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }
};

const admin = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.isAdmin === true)) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admin privileges required." });
  }
};

module.exports = { protect, admin };
