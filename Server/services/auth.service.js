const { verifyToken } = require("../middlewares/jwt");
const { AppError } = require("../middlewares/errorHandler");
require("dotenv").config();

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return next(new AppError("Please login for token.", 401, "NO_TOKEN"));
    }

    const userInfo = verifyToken(token);
    if (!userInfo) {
      return next(
        new AppError("Invalid authentication token.", 403, "INVALID_TOKEN")
      );
    }

    req.user = userInfo;
    return next();
  } catch (error) {
    return next(
      new AppError(
        error.message || "Internal Server Error",
        error.status || 500,
        "AUTHENTICATION_ERROR"
      )
    );
  }
};

module.exports = auth;
