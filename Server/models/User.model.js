const mongoose = require("mongoose");
const Name = require("../modules/Users/helpers/mongodb/Name");
const {
  PHONE,
  EMAIL,
} = require("../modules/Users/helpers/mongodb/mongooseValidator");
const Address = require("../modules/Users/helpers/mongodb/Address");
const Image = require("../modules/Users/helpers/mongodb/Image");

const userSchema = new mongoose.Schema({
  name: Name,
  phone: PHONE,
  email: EMAIL,
  password: {
    type: String,
    minLength: 7,
    maxLength: 1024,
    required: true,
    trim: true,
  },
  image: Image,
  address: Address,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isBusiness: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Date,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
