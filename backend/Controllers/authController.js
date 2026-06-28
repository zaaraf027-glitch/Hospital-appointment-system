const User = require("../Models/UserModels");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcrypt");

module.exports.Signup = async (req, res, next) => {
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
module.exports.Login = async (req, res, next) => {
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
