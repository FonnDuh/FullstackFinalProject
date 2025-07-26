const mongoose = require("mongoose");
const Name = require("../../helpers/users/mongodb/Name");
const { EMAIL } = require("../../helpers/users/mongodb/mongooseValidator");
const Image = require("../../helpers/users/mongodb/Image");

const userSchema = new mongoose.Schema({
  name: Name,
  email: EMAIL,
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: 3,
    maxLength: 50,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    minLength: 7,
    maxLength: 1024,
    required: true,
    trim: true,
  },
  image: Image,
  isAdmin: {
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
