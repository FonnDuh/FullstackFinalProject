const { verifyToken } = require("../middlewares/jwt");
const { AppError } = require("../middlewares/errorHandler");
require("dotenv").config();

const auth = (req, res, next) => {
  try {
    const token = req.header("Auth-Token");
    if (!token) {
      return next(new AppError("Please login for token.", 401, "NO_TOKEN"));
    }

    const userInfo = verifyToken(token);
    if (userInfo instanceof Error) {
      console.log("JWT verification failed:", userInfo);

      if (userInfo.name === "TokenExpiredError") {
        return next(
          new AppError(
            "Token expired. Please login again.",
            401,
            "TOKEN_EXPIRED"
          )
        );
      }
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
