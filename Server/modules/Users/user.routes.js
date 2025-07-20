const express = require("express");
const {
  registerUser,
  getUserByID,
  getAllUsers,
  loginUser,
  updateUser,
  changeBusinessStatus,
  deleteUser,
} = require("./userAccessData.service");
const auth = require("../../services/auth.service");
const returnUser = require("./helpers/returnUser");
const {
  validateRegister,
  validateLogin,
} = require("../Users/validation/userValidation.service");
const { AppError } = require("../../middlewares/errorHandler");

const router = express.Router();

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
    throw new AppError(error.message || "Error creating user.", 500);
  }
});

// Get user by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userInfo = req.user;
    if (!userInfo.isAdmin && userInfo._id != id)
      throw new AppError("You can only get your own profile.", 403);
    const user = await getUserByID(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    res.status(200).send(user);
  } catch (error) {
    throw new AppError(error.message || "Error fetching user by ID.", 500);
  }
});

// Get all users
router.get("/", auth, async (req, res) => {
  let userInfo = req.user;

  try {
    if (!userInfo.isAdmin)
      throw new AppError("You are not authorized to view all users.", 403);

    let users = await getAllUsers();
    res.status(200).send(users);
  } catch (error) {
    throw new AppError(error.message || "Error fetching all users.", 500);
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const validationErrors = validateLogin(req.body);

    if (validationErrors != "") throw new AppError(validationErrors, 400);

    const token = await loginUser(email, password);
    res.status(200).send({ token });
  } catch (error) {
    if (error.status === 403) {
      throw new AppError("Login failed. " + error.message, 403);
    }
    if (error.status === 404) {
      throw new AppError("Login failed. User not found.", 404);
    }
    throw new AppError(error.message || "Error logging in.", 500);
  }
});

// Update user
router.put("/:id", auth, async (req, res) => {
  let userInfo = req.user;
  let updatedUser = req.body;
  const { id } = req.params;
  try {
    if (userInfo._id !== id && !userInfo.isAdmin)
      throw new AppError("You can only update your own profile.", 403);

    const errorMessage = validateRegister(req.body);
    if (errorMessage != "") {
      throw new AppError(errorMessage, 400);
    }
    let user = await updateUser(id, updatedUser);
    res.status(201).send(returnUser(user));
  } catch (error) {
    if (error.status === 403) {
      throw new AppError("Update failed. " + error.message, 403);
    }
    if (error.status === 404) {
      throw new AppError("Update failed. User not found.", 404);
    }
    throw new AppError(error.message || "Error updating user.", 500);
  }
});

// Change business status
// router.patch("/:id", auth, async (req, res) => {
//   const { id } = req.params;
//   const userInfo = req.user;
//   try {
//     if (userInfo._id !== id) {
//       throw createError(
//         "Authorization",
//         "You can only change your own business status.",
//         403
//       );
//     }

//     let user = await changeBusinessStatus(id);
//     res.status(201).send(returnUser(user));
//   } catch (error) {
//     return handleError(res, error.status, error.message);
//   }
// });

// Delete user
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  let userInfo = req.user;

  try {
    if (!userInfo.isAdmin && userInfo._id !== id)
      throw new AppError("You can only delete your own profile.", 403);

    let user = await deleteUser(id);
    res.status(200).send(returnUser(user));
  } catch (error) {
    if (error.status === 403) {
      throw new AppError("Delete failed. " + error.message, 403);
    }
    if (error.status === 404) {
      throw new AppError("Delete failed. User not found.", 404);
    }
    throw new AppError(error.message || "Error deleting user.", 500);
  }
});

module.exports = router;
