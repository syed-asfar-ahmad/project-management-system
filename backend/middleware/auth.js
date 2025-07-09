const jwt = require('jsonwebtoken');

// Middleware to verify JWT Token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get token from header

  if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next(); // Go to next step
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware to check if user has a specific role
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden. You are not allowed.' });
    }
    next(); // Role is allowed
  };
};

module.exports = { verifyToken, checkRole };
