const bcrypt = require("bcrypt");

const generatePassword = async (password) => bcrypt.hashSync(password, 10);

const comparePassword = async (password, cryptPassword) => {
  return bcrypt.compareSync(password, cryptPassword);
};

module.exports = { generatePassword, comparePassword };
