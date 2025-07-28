const {
  registerUser,
  getUserByID,
  getAllUsers,
  loginUser,
  updateUser,
  deleteUser,
} = require("../services/user.service");
const auth = require("../services/auth.service");
const returnUser = require("../helpers/users/returnUser");
const {
  validateRegister,
  validateLogin,
} = require("../validation/users/user.validation");
const { AppError } = require("../middlewares/errorHandler");

const { Router } = require("express");
const router = Router();

// Register a new user
router.post("/", async (req, res) => {
  try {
    const newUser = req.body;
    const validationErrors = validateRegister(newUser);

    if (validationErrors != "")
      return res.status(400).json({ message: validationErrors });

    const user = await registerUser(newUser);
    res.status(201).send(returnUser(user));
  } catch (error) {
    throw new AppError(
      error.message || "Error creating user.",
      500,
      "USER_CREATION_FAILED"
    );
  }
});

// Get user by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userInfo = req.user;
    if (!userInfo.isAdmin && userInfo._id != id)
      throw new AppError(
        "You can only get your own profile.",
        403,
        "UNAUTHORIZED_ACCESS"
      );
    const user = await getUserByID(id);
    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }
    res.status(200).send(user);
  } catch (error) {
    throw new AppError(
      error.message || "Error fetching user by ID.",
      500,
      "FETCH_USER_BY_ID_FAILED"
    );
  }
});

// Get all users
router.get("/", auth, async (req, res) => {
  let userInfo = req.user;

  try {
    if (!userInfo.isAdmin)
      throw new AppError(
        "You are not authorized to view all users.",
        403,
        "UNAUTHORIZED_ACCESS"
      );

    let users = await getAllUsers();
    res.status(200).send(users);
  } catch (error) {
    throw new AppError(
      error.message || "Error fetching all users.",
      500,
      "FETCH_ALL_USERS_FAILED"
    );
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const validationErrors = validateLogin(req.body);

    if (validationErrors != "")
      throw new AppError(validationErrors, 400, "LOGIN_VALIDATION_FAILED");

    const token = await loginUser(email, password);
    res.status(200).send({ token });
  } catch (error) {
    if (error.status === 403) {
      throw new AppError("Login failed. " + error.message, 403, "LOGIN_FAILED");
    }
    if (error.status === 404) {
      throw new AppError(
        "Login failed. User not found.",
        404,
        "USER_NOT_FOUND"
      );
    }
    throw new AppError(
      error.message || "Error logging in.",
      500,
      "LOGIN_ERROR"
    );
  }
});

// Update user
router.put("/:id", auth, async (req, res) => {
  let userInfo = req.user;
  let updatedUser = req.body;
  const { id } = req.params;
  try {
    if (userInfo._id !== id && !userInfo.isAdmin)
      throw new AppError(
        "You can only update your own profile.",
        403,
        "UNAUTHORIZED_UPDATE"
      );

    const errorMessage = validateRegister(req.body);
    if (errorMessage != "") {
      throw new AppError(errorMessage, 400, "UPDATE_VALIDATION_FAILED");
    }
    let user = await updateUser(id, updatedUser);
    res.status(201).send(returnUser(user));
  } catch (error) {
    if (error.status === 403) {
      throw new AppError(
        "Update failed. " + error.message,
        403,
        "UPDATE_FORBIDDEN"
      );
    }
    if (error.status === 404) {
      throw new AppError(
        "Update failed. User not found.",
        404,
        "USER_NOT_FOUND"
      );
    }
    throw new AppError(
      error.message || "Error updating user.",
      500,
      "UPDATE_ERROR"
    );
  }
});

// Delete user
// Will also delete all user related media!
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  let userInfo = req.user;

  try {
    if (!userInfo.isAdmin && userInfo._id !== id)
      throw new AppError(
        "You can only delete your own profile.",
        403,
        "UNAUTHORIZED_DELETE"
      );

    let user = await deleteUser(id);
    res.status(200).send(returnUser(user));
  } catch (error) {
    if (error.status === 403) {
      throw new AppError(
        "Delete failed. " + error.message,
        403,
        "DELETE_FORBIDDEN"
      );
    }
    if (error.status === 404) {
      throw new AppError(
        "Delete failed. User not found.",
        404,
        "USER_NOT_FOUND"
      );
    }
    throw new AppError(
      error.message || "Error deleting user.",
      500,
      "DELETE_ERROR"
    );
  }
});

module.exports = router;
