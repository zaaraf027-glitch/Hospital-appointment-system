import jwt from "jsonwebtoken";
import User from "../Models/UserModels.js";

export const userVerification = async (req, res) => {
  const token = req.cookies.token;
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
