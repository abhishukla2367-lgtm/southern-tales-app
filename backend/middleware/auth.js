const jwt = require('jsonwebtoken');

/**
 * @desc    Middleware to protect routes - Verify JWT and attach user to request
 * Satisfies Task 4 & 6: Only logged-in users can access specific routes
 */
const protect = (req, res, next) => {
    let token;

    // 1. Check for token in the Authorization header (Standard Bearer format)
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header: "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify the token using your secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Attach decoded user data (id, role) to the request object
            // This allows req.user.id to be used in your Order/Reservation controllers
            req.user = {
    ...decoded,
    _id: decoded.id || decoded._id 
};

            next();
        } catch (error) {
            console.error("Auth Middleware Error:", error.message);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token provided" });
    }
};

/**
 * @desc    Middleware to restrict access to Admins only
 * Satisfies Task 8.3: Admin side Orders & Reservations pages
 */
const admin = (req, res, next) => {
    // Checks the 'role' field we stored in the JWT during login
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Access denied: Admins only" });
    }
};

module.exports = { protect, admin };
