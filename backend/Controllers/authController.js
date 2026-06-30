import User from "../Models/UserModels.js";
import createSecretToken from "../utils/SecretToken.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const Signup = async (req, res, next) => {
  try {
    
    console.log("req received");

    const { email, password, username, createdAt } = req.body;
    console.log("accessed");
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(404).json({
        message: "User already exists",
      });
    }
    console.log("checked");
    const user = await User.create({ email, password, username });
    console.log("user created");
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredientials: true,
      httpOnly: false,
    });
    res.status(201).json({
      success: true,
      message: "User SignedIn Successfully",
      user,
    });
    next();
  } catch (err) {
    console.log(err);
  }
};
export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        message: "All fields are required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: "Incorrect password or email",
      });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({
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
    });
    next();
  } catch (err) {
    console.log(err);
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
            role: user.role
        });

    } catch (error) {

        return res.status(500).json({
            status: false,
            message: error.message
        });

    }
};