const { verifyToken } = require("../auth/providers/jwt");
const { AppError } = require("../middlewares/errorHandler");
require("dotenv").config();

const TOKEN_GENERATOR = process.env.TOKEN_GENERATOR || "jwt";

const auth = (req, res, next) => {
  if (TOKEN_GENERATOR === "jwt") {
    try {
      const token = req.header("x-auth-token");
      if (!token) {
        return next(new AppError("Please login for token.", 401));
      }

      const userInfo = verifyToken(token);
      if (!userInfo) {
        return next(new AppError("Invalid authentication token.", 403));
      }

      req.user = userInfo;
      return next();
    } catch (error) {
      return next(
        new AppError(
          error.message || "Internal Server Error",
          error.status || 500
        )
      );
    }
  }
  return next(
    new AppError(
      "Authentication method not supported. Please contact support.",
      500
    )
  );
};

module.exports = auth;
