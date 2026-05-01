import jwt from "jsonwebtoken";

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
