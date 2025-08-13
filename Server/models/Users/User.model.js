const { Schema, model } = require("mongoose");
const Name = require("../../helpers/users/mongodb/Name");
const { EMAIL } = require("../../helpers/users/mongodb/mongooseValidator");

const userSchema = new Schema({
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
  image_url: {
    type: String,
    default: "",
  },
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

userSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    // Delete all user media associated with this user
    await model("UserMedia").deleteMany({ user_id: doc._id });
  }
});

const User = model("User", userSchema);
module.exports = User;
