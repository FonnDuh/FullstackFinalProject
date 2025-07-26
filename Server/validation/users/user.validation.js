const loginValidation = require("./joi/login.validation");
const registerValidation = require("./joi/register.validation");

const validateRegister = (user) => {
  const { error } = registerValidation(user);
  if (error) return error.details.map((detail) => detail.message);
  return "";
};

const validateLogin = (user) => {
  const { error } = loginValidation(user);
  if (error) return error.details.map((detail) => detail.message);
  return "";
};

module.exports = {
  validateRegister,
  validateLogin,
};
