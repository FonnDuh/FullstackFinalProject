const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

const generateToken = (user) => {
  const payload = {
    // _id: user._id,
    // isAdmin: user.isAdmin,
    // isBusiness: user.isBusiness,
  };

  const token = jwt.sign(payload, SECRET_KEY);
  return token;
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
