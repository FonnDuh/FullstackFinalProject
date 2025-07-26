const mongoose = require("mongoose");
const { DEFAULT_VALIDATION } = require("./mongooseValidator");

const Name = new mongoose.Schema({
  first: DEFAULT_VALIDATION,
  last: DEFAULT_VALIDATION,
});

module.exports = Name;
