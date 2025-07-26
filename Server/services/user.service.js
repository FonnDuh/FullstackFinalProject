const { generateToken } = require("../middlewares/jwt");
const {
  generatePassword,
  comparePassword,
} = require("../helpers/users/bcrypt");
const User = require("../models/Users/User.model");
const { AppError } = require("../middlewares/errorHandler");

// Register new user
const registerUser = async (newUser) => {
  try {
    newUser.password = await generatePassword(newUser.password);
    let user = new User(newUser);
    user = await user.save();
    return user;
  } catch (error) {
    throw new AppError(
      error.message || "Error creating user.",
      500,
      "USER_CREATION_FAILED"
    );
  }
};

// Get user by ID
const getUserByID = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found.", 404, "USER_NOT_FOUND");
    }
    return user;
  } catch (error) {
    throw new AppError(
      error.message || "Error fetching user by ID.",
      500,
      "FETCH_USER_BY_ID_FAILED"
    );
  }
};

// Get all users
const getAllUsers = async () => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      throw new AppError("No users found.", 404, "NO_USERS_FOUND");
    }
    return users;
  } catch (error) {
    throw new AppError(
      error.message || "Error fetching all users.",
      500,
      "FETCH_ALL_USERS_FAILED"
    );
  }
};

// User login
const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }
    if (user.lockUntil && user.lockUntil > new Date()) {
      const remainingTime = Math.ceil(
        (user.lockUntil - new Date()) / (1000 * 60 * 60) // in hours
      );
      throw new AppError(
        `Account locked. Try again in ${remainingTime} hour(s).`,
        403,
        "ACCOUNT_LOCKED"
      );
    }
    if (!(await comparePassword(password, user.password))) {
      const loginAttempts = (user.loginAttempts || 0) + 1;
      user.loginAttempts = loginAttempts;

      if (loginAttempts >= 3)
        user.lockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await user.save();
      throw new AppError(
        "Email or Password Invalid.",
        401,
        "INVALID_CREDENTIALS"
      );
    }

    // Reset login attempts and lockUntil on successful login
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();
    return generateToken(user);
  } catch (error) {
    throw new AppError(
      error.message || "Error logging in user.",
      500,
      "LOGIN_ERROR"
    );
  }
};

// Update user
const updateUser = async (userId, updatedUser) => {
  try {
    const userFromDB = await User.findById(userId);
    if (!userFromDB) {
      throw new AppError("User not found.", 404, "USER_NOT_FOUND");
    }
    let user = await User.findByIdAndUpdate(userId, updatedUser);
    if (!user) {
      throw new AppError("Error updating user.", 500, "UPDATE_ERROR");
    }
    user = await user.save();
    return user;
  } catch (error) {
    throw new AppError(
      error.message || "Error updating user.",
      500,
      "UPDATE_ERROR"
    );
  }
};

// Delete user
const deleteUser = async (userId) => {
  try {
    let user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found.", 404, "USER_NOT_FOUND");
    }

    user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new AppError("Error deleting user.", 500, "DELETE_ERROR");
    }
    return user;
  } catch (error) {
    throw new AppError(
      error.message || "Error deleting user.",
      500,
      "DELETE_ERROR"
    );
  }
};

module.exports = {
  registerUser,
  getUserByID,
  getAllUsers,
  loginUser,
  updateUser,
  deleteUser,
};
