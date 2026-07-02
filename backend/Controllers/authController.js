import User from "../Models/UserModels.js";
import createSecretToken from "../utils/SecretToken.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Signup = async (req, res, next) => {
  try {
    console.log("req received");
    const { email, password, username, role,accessCode } = req.body;
    console.log("accessed");
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(404).json({
        success: false,
        message: "User already exists",
      });
    }
    console.log(accessCode);
    if(role ==="admin" ){
      if(accessCode != process.env.ACCESS_CODE){
        return res.status(403).json({
          success :false,
          message:"not authorized as admin",
        })
      }
    }
    console.log("checked");
    const user = await User.create({ email, password, username, role });
    console.log("user created");
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredientials: true,
      httpOnly: false,
    });
    res.status(201).json({
      success: true,
      message: "User SignedIn Successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
    });
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
   console.log(req.body);
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password or email",
      });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredientials: true,
      httpOnly: false,
    });
    res.status(201).json({
      message: "User Logged In SuccessFully",
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const Logout = async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const VerifyUser = async (req, res) => {
    try {
        // Get token from cookies
        const token = req.cookies.token;

        // If token doesn't exist
        if (!token) {
            return res.status(401).json({
                status: false,
                message: "No token found"
            });
        }

        // Verify JWT
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);

        // Find user in database
        const user = await User.findById(decoded.id);

        // User not found
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        // User verified successfully
        return res.status(200).json({
            status: true,
            message: "User Verified Successfully",
            user: user.username,
            role: user.role,
            id: user._id
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};