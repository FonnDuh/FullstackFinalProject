const { hashSync, compareSync } = require("bcrypt");

const generatePassword = async (password) => hashSync(password, 10);

const comparePassword = async (password, cryptPassword) => {
  return compareSync(password, cryptPassword);
};

module.exports = { generatePassword, comparePassword };
