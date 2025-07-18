const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.customerId || !decoded.role) {
      return res.status(401).json({
        error: "Token must contain customerId and role",
      });
    }

    req.user = {
      id: decoded.userId, // ✅ correct
      customerId: decoded.customerId,
      role: decoded.role.toLowerCase(),
    };
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

// Tenant isolation middleware
const tenant = (req, res, next) => {
  // Add customerId filter to req for database queries
  req.tenantFilter = { customerId: req.user.customerId };
  next();
};

// Admin role middleware
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

// Admin route middleware (combines auth + adminOnly)
const adminRoute = [auth, adminOnly];

module.exports = {
  auth,
  tenant,
  adminOnly,
  adminRoute,
  JWT_SECRET,
};
