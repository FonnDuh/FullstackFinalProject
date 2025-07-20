const { generateToken } = require("../../auth/providers/jwt");
const { generatePassword, comparePassword } = require("./helpers/bcrypt");
const User = require("../../models/User.model");
const { AppError } = require("../../middlewares/errorHandler");

// Register new user
const registerUser = async (newUser) => {
  try {
    newUser.password = await generatePassword(newUser.password);
    let user = new User(newUser);
    user = await user.save();
    return user;
  } catch (error) {
    throw new AppError(error.message || "Error creating user.", 500);
  }
};

// Get user by ID
const getUserByID = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found.", 404);
    }
    return user;
  } catch (error) {
    throw new AppError(error.message || "Error fetching user by ID.", 500);
  }
};

// Get all users
const getAllUsers = async () => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      throw new AppError("No users found.", 404);
    }
    return users;
  } catch (error) {
    throw new AppError(error.message || "Error fetching all users.", 500);
  }
};

// User login
const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("User not found", 404);
    }
    if (user.lockUntil && user.lockUntil > new Date()) {
      const remainingTime = Math.ceil(
        (user.lockUntil - new Date()) / (1000 * 60 * 60) // in hours
      );
      throw new AppError(
        `Account locked. Try again in ${remainingTime} hour(s).`,
        403
      );
    }
    if (!(await comparePassword(password, user.password))) {
      const loginAttempts = (user.loginAttempts || 0) + 1;
      user.loginAttempts = loginAttempts;

      if (loginAttempts >= 3)
        user.lockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await user.save();
      throw new AppError("Email or Password Invalid.", 401);
    }

    // Reset login attempts and lockUntil on successful login
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();
    return generateToken(user);
  } catch (error) {
    throw new AppError(error.message || "Error logging in user.", 500);
  }
};

// Update user
const updateUser = async (userId, updatedUser) => {
  try {
    const userFromDB = await User.findById(userId);
    if (!userFromDB) {
      throw new AppError("User not found.", 404);
    }
    let user = await User.findByIdAndUpdate(userId, updatedUser);
    if (!user) {
      throw new AppError("Error updating user.", 500);
    }
    user = await user.save();
    return user;
  } catch (error) {
    throw new AppError(error.message || "Error updating user.", 500);
  }
};

// Change business status
// const changeBusinessStatus = async (id) => {
//   let user = await User.findById(id);
//   if (!user) {
//     throw new AppError("User not found.", 404);
//   }
//   user.isBusiness = !user.isBusiness;
//   user = await user.save();
//   return user;
// };

// Delete user
const deleteUser = async (userId) => {
  try {
    let user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found.", 404);
    }

    user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new AppError("Error deleting user.", 500);
    }
    return user;
  } catch (error) {
    throw new AppError(error.message || "Error deleting user.", 500);
  }
};

module.exports = {
  registerUser,
  getUserByID,
  getAllUsers,
  loginUser,
  updateUser,
  // changeBusinessStatus,
  deleteUser,
};
