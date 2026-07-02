import jwt from "jsonwebtoken";

const createSecretToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: 2 * 24 * 60 * 60, // 2 days
  });
};

export default createSecretToken;