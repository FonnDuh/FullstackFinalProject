const { sign, verify } = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

const generateToken = (user) => {
  const payload = {
    _id: user._id,
    username: user.username,
    isAdmin: user.isAdmin,
  };

  const token = sign(payload, SECRET_KEY, { expiresIn: "24h" });
  return token;
};

const verifyToken = (token) => {
  try {
    const decoded = verify(token, SECRET_KEY);
    return decoded;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return error;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
