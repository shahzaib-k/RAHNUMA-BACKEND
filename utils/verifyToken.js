import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: "No token provided, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123'); // From auth.controller it was 'secret123' if env missing
    req.user = decoded; // Contains id from the token
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: "Access denied. Admins only." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
