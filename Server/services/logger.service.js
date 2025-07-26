const morganLogger = require("../config/morganLogger");

require("dotenv").config();

const LOGGER = process.env.LOGGER || "Morgan";

const loggerMiddleware = () => {
  if (LOGGER === "Morgan") {
    return morganLogger;
  }
};

module.exports = loggerMiddleware;