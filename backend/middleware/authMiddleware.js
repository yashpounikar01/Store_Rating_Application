const jwt = require("jsonwebtoken");

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware for role-based access
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  next();
};

const storeOwnerOnly = (req, res, next) => {
  if (req.user.role !== "store_owner") return res.status(403).json({ message: "Forbidden" });
  next();
};

module.exports = { authMiddleware, adminOnly, storeOwnerOnly };
