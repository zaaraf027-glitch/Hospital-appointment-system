import User from "../Models/UserModels.js";
import createSecretToken from "../utils/SecretToken.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Convert raw Mongoose/MongoDB errors into user-friendly messages
const sanitizeError = (err) => {
  const msg = err.message || '';
  if (msg.includes('buffering timed out') || msg.includes('ECONNREFUSED') || msg.includes('MongoNetworkError')) {
    return 'Database connection error. Please try again in a moment.';
  }
  return msg;
};

// ── Cookie helper ─────────────────────────────────────────────────────────────
// On Vercel, frontend and backend are on different subdomains → cross-origin.
// Cookies MUST be sameSite:"none" + secure:true to be sent cross-origin.
// httpOnly:true prevents XSS from reading the token via document.cookie.
const cookieOptions = {
  httpOnly: true,
  secure: true,       // Required for sameSite:"none" and for HTTPS (Vercel is always HTTPS)
  sameSite: "none",   // Required for cross-origin cookie sending
  maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days in milliseconds (matches JWT expiry)
};

export const Signup = async (req, res) => {
  try {
    console.log("[Signup] Request received");
    const { email, password, username, role, accessCode } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({
        success: false,
        message: "email, password, and username are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    if (role === "admin") {
      if (!accessCode || accessCode !== process.env.ACCESS_CODE) {
        return res.status(403).json({
          success: false,
          message: "Not authorized as admin — invalid access code",
        });
      }
    }

    const user = await User.create({ email, password, username, role });
    console.log("[Signup] User created:", user._id);

    const token = createSecretToken(user._id);
    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "User signed up successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("[Signup] Error:", err.message);
    return res.status(500).json({
      success: false,
      message: sanitizeError(err),
    });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("[Login] Attempt for:", email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    const token = createSecretToken(user._id);
    res.cookie("token", token, cookieOptions);

    console.log("[Login] Success for:", user._id);
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("[Login] Error:", err.message);
    return res.status(500).json({
      success: false,
      message: sanitizeError(err),
    });
  }
};

export const Logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      ...cookieOptions,
      maxAge: 0, // expire immediately
    });
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("[Logout] Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const VerifyUser = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "No token found — please log in",
      });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "User verified successfully",
      user: user.username,
      role: user.role,
      id: user._id,
    });
  } catch (error) {
    console.error("[VerifyUser] Error:", error.message);
    return res.status(401).json({
      status: false,
      message: "Invalid or expired token",
    });
  }
};