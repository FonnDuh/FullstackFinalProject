const loginValidation = require("./joi/loginValidation");
const registerValidation = require("./joi/registerValidation");
require("dotenv").config();

const VALIDATOR = process.env.VALIDATOR || "Joi";

const validateRegister = (user) => {
  if (VALIDATOR === "Joi") {
    const { error } = registerValidation(user);
    if (error) return error.details.map((detail) => detail.message);
    return "";
  }
  return "";
};

const validateLogin = (user) => {
  if (VALIDATOR === "Joi") {
    const { error } = loginValidation(user);
    if (error) return error.details.map((detail) => detail.message);
    return "";
  }
  return "";
};

module.exports = {
  validateRegister,
  validateLogin,
};
