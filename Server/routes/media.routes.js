const express = require("express");
const auth = require("../services/auth.service");
const {
  createMedia,
  getAllUserMediaById,
  getMyUserMedia,
  updateMedia,
  deleteMedia,
  getAllUserMedia,
  getMediaById,
} = require("../services/userMedia.service");
const userMediaValidation = require("../validation/users/userMedia.validation");
const router = express.Router();

function formatValidationErrors(errors) {
  if (Array.isArray(errors)) {
    return errors.map((e) => {
      return e.replace(/"/g, "");
    });
  }
  return errors;
}

// Create new media
router.post("/", auth, async (req, res, next) => {
  try {
    const userInfo = req.user;

    if (!userInfo || !userInfo._id) {
      return res.status(401).json({ message: "Unauthorized user." });
    }
    const media = req.body;
    const validationError = userMediaValidation(media);
    if (validationError)
      return res
        .status(400)
        .json({ errors: formatValidationErrors(validationError) });

    const createdMedia = await createMedia(media, userInfo._id);
    res.status(201).json(createdMedia);
  } catch (error) {
    console.error("Error creating media:", error);
    next(error);
  }
});

// get media by media id
router.get("/:mediaId/all", auth, async (req, res, next) => {
  try {
    const userInfo = req.user;

    if (!userInfo || !userInfo._id) {
      return res.status(401).json({ message: "Unauthorized user." });
    }

    const { mediaId } = req.params;
    const media = await getMediaById(mediaId);
    if (!media) {
      return res.status(404).json({ message: "Media not found." });
    }
    res.status(200).json(media);
  } catch (error) {
    console.error("Error fetching media by ID:", error);
    next(error);
  }
});

// Get all user media
router.get("/", auth, async (req, res, next) => {
  try {
    const userInfo = req.user;

    if (!userInfo || !userInfo._id) {
      return res.status(401).json({ message: "Unauthorized user." });
    }

    const mediaList = await getAllUserMedia();
    res.status(200).json(mediaList);
  } catch (error) {
    console.error("Error fetching user media:", error);
    next(error);
  }
});

// Get user media by user id
router.get("/:id", auth, async (req, res, next) => {
  try {
    const userInfo = req.user;

    if (!userInfo || !userInfo._id) {
      return res.status(401).json({ message: "Unauthorized user." });
    }
    const { id } = req.params;
    if (id !== userInfo._id.toString()) {
      return res.status(403).json({ message: "Access denied." });
    }

    const mediaList = await getAllUserMediaById(userInfo._id);
    res.status(200).json(mediaList);
  } catch (error) {
    console.error("Error fetching user media:", error);
    next(error);
  }
});

// Get my user media
router.get("/:id/my-media", auth, async (req, res, next) => {
  try {
    const userInfo = req.user;
    if (!userInfo || !userInfo._id) {
      return res.status(401).json({ message: "Unauthorized user." });
    }

    const { id } = req.params;
    if (id !== userInfo._id.toString()) {
      return res.status(403).json({ message: "Access denied." });
    }
    const media = await getMyUserMedia(id);
    if (!media) {
      return res.status(404).json({ message: "Media not found." });
    }
    res.status(200).json(media);
  } catch (error) {
    console.error("Error fetching your media:", error);
    next(error);
  }
});

// Update user media
router.put("/:id", auth, async (req, res, next) => {
  try {
    const userInfo = req.user;
    if (!userInfo || !userInfo._id) {
      return res.status(401).json({ message: "Unauthorized user." });
    }
    const { id } = req.params;
    const media = req.body;
    const validationError = userMediaValidation(media);

    if (validationError)
      return res
        .status(400)
        .json({ errors: formatValidationErrors(validationError) });

    const updatedMedia = await updateMedia(id, userInfo._id, media);
    res.status(200).json(updatedMedia);
  } catch (error) {
    console.error("Error updating media:", error);
    next(error);
  }
});

// Delete user media
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const userInfo = req.user;
    if (!userInfo || !userInfo._id) {
      return res.status(401).json({ message: "Unauthorized user." });
    }
    const { id } = req.params;
    const deleted = await deleteMedia(id, userInfo._id);
    if (!deleted) {
      return res.status(404).json({ message: "Media not found." });
    }
    res.status(204).send("Media deleted successfully.");
  } catch (error) {
    console.error("Error deleting media:", error);
    next(error);
  }
});

// Delete all user media by user id
router.delete("/:id/all", auth, async (req, res, next) => {
  try {
    const userInfo = req.user;
    if (!userInfo || !userInfo._id) {
      return res.status(401).json({ message: "Unauthorized user." });
    }
    const { id } = req.params;
    if (id !== userInfo._id.toString()) {
      return res.status(403).json({ message: "Access denied." });
    }

    await deleteAllUserMedia(userInfo._id);
    res.status(204).send("All media deleted successfully.");
  } catch (error) {
    console.error("Error deleting all user media:", error);
    next(error);
  }
});

module.exports = router;
