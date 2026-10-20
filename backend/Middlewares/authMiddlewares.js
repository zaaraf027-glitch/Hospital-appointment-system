import jwt from "jsonwebtoken";
import User from "../Models/UserModels.js";

/**
 * Middleware: requireAuth
 * Extracts JWT token from Authorization header or HTTP-only cookies.
 * Verifies token, fetches user, and attaches to req.user.
 */
export const requireAuth = async (req, res, next) => {
  try {
    let token = null;

    // 1. Check Authorization header: Bearer <token>
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    // 2. Fallback to cookie
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in to proceed.",
      });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User session not found or account no longer exists.",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("[requireAuth] Token error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid token. Please log in again.",
    });
  }
};

/**
 * Middleware: requireRole
 * Restricts route access to specific roles (e.g. 'admin', 'patient')
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: this action requires '${roles.join(" or ")}' privileges.`,
      });
    }

    next();
  };
};

/**
 * Legacy handler preserved for backwards compatibility with any existing /verify calls
 */
export const userVerification = async (req, res) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.json({ status: false });
  }
  try {
    const data = jwt.verify(token, process.env.TOKEN_KEY);
    const user = await User.findById(data.id);
    if (user) {
      return res.json({ status: true, user: user.username });
    }
    return res.json({ status: false });
  } catch (err) {
    return res.json({ status: false });
  }
};

