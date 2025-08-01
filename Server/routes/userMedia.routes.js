const auth = require("../services/auth.service");
const {
  createMedia,
  getAllUserMediaById,
  getMyUserMedia,
  updateMedia,
  deleteMedia,
  getMediaById,
  getUserMediaByStatus,
  getUserMediaByType,
} = require("../services/userMedia.service");
const {
  userMediaValidation,
} = require("../validation/media/userMedia.validation");
const {
  userMediaUpdateValidation,
} = require("../validation/media/userMediaUpdate.validation");
const { Router } = require("express");
const router = Router();

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

// Get all media for current user
router.get("/", auth, async (req, res, next) => {
  try {
    const userInfo = req.user;

    if (!userInfo || !userInfo._id) {
      return res.status(401).json({ message: "Unauthorized user." });
    }

    const mediaList = await getMyUserMedia(userInfo._id);
    res.status(200).json(mediaList);
  } catch (error) {
    console.error("Error fetching user media:", error);
    next(error);
  }
});

// Get a single media for current user
router.get("/:mediaId", auth, async (req, res, next) => {
  try {
    const userInfo = req.user;

    if (!userInfo || !userInfo._id) {
      return res.status(401).json({ message: "Unauthorized user." });
    }

    const { mediaId } = req.params;
    const media = await getMediaById(mediaId, userInfo._id);
    if (!media) {
      return res.status(404).json({ message: "Media not found." });
    }
    res.status(200).json(media);
  } catch (error) {
    console.error("Error fetching media by ID:", error);
    next(error);
  }
});

// Get media by media ID and user ID
router.get("/user/:userId/media/:mediaId", auth, async (req, res, next) => {
  try {
    const userInfo = req.user;

    if (!userInfo || !userInfo._id) {
      return res.status(401).json({ message: "Unauthorized user." });
    }

    const { userId, mediaId } = req.params;
    if (userId !== userInfo._id.toString()) {
      return res.status(403).json({ message: "Forbidden: Access denied." });
    }

    const media = await getMediaById(mediaId, userId);
    if (!media) {
      return res.status(404).json({ message: "Media not found." });
    }
    res.status(200).json(media);
  } catch (error) {
    console.error("Error fetching media by user ID and media ID:", error);
    next(error);
  }
});

// Get user media by status
router.get("/status/:status", auth, async (req, res, next) => {
  try {
    const userInfo = req.user;

    if (!userInfo || !userInfo._id) {
      return res.status(401).json({ message: "Unauthorized user." });
    }

    const { status } = req.params;
    const mediaList = await getUserMediaByStatus(userInfo._id, status);
    res.status(200).json(mediaList);
  } catch (error) {
    console.error("Error fetching user media by status:", error);
    next(error);
  }
});

// Get user media by type
router.get("/type/:mediaType", auth, async (req, res, next) => {
  try {
    const userInfo = req.user;

    if (!userInfo || !userInfo._id) {
      return res.status(401).json({ message: "Unauthorized user." });
    }

    const { mediaType } = req.params;
    const mediaList = await getUserMediaByType(userInfo._id, mediaType);
    res.status(200).json(mediaList);
  } catch (error) {
    console.error("Error fetching user media by type:", error);
    next(error);
  }
});

// Update a single media for current user
router.put("/:mediaId", auth, async (req, res, next) => {
  try {
    const userInfo = req.user;
    if (!userInfo || !userInfo._id) {
      return res.status(401).json({ message: "Unauthorized user." });
    }
    const { mediaId } = req.params;
    const media = req.body;
    const validationError = userMediaUpdateValidation(media);
    if (validationError)
      return res
        .status(400)
        .json({ errors: formatValidationErrors(validationError) });

    const updatedMedia = await updateMedia(mediaId, userInfo._id, media);
    res.status(200).json(updatedMedia);
  } catch (error) {
    console.error("Error updating media:", error);
    next(error);
  }
});

// Update media status for current user
router.patch("/:mediaId/status", auth, async (req, res, next) => {
  try {
    const userInfo = req.user;
    if (!userInfo || !userInfo._id) {
      return res.status(401).json({ message: "Unauthorized user." });
    }
    const { mediaId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required." });
    }

    const updatedMedia = await updateMedia(mediaId, userInfo._id, { status });
    res.status(200).json(updatedMedia);
  } catch (error) {
    console.error("Error updating media status:", error);
    next(error);
  }
});

// Delete a single media for current user
router.delete("/:mediaId", auth, async (req, res, next) => {
  try {
    const userInfo = req.user;
    if (!userInfo || !userInfo._id) {
      return res.status(401).json({ message: "Unauthorized user." });
    }
    const { mediaId } = req.params;
    const deleted = await deleteMedia(mediaId, userInfo._id);
    if (!deleted) {
      return res.status(404).json({ message: "Media not found." });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting media:", error);
    next(error);
  }
});

// Admin: Delete a single media for any user
router.delete("/user/:userId/media/:mediaId", auth, async (req, res, next) => {
  try {
    const userInfo = req.user;

    if (!userInfo || !userInfo._id) {
      return res.status(401).json({ message: "Unauthorized user." });
    }

    if (!userInfo.isAdmin)
      return res
        .status(403)
        .json({ message: "Forbidden: Admin access required." });

    const { userId, mediaId } = req.params;
    const deleted = await deleteMedia(mediaId, userId);
    if (!deleted) {
      return res.status(404).json({ message: "Media not found." });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting media for user:", error);
    next(error);
  }
});

// Admin: Get all media for a user
router.get("/user/:userId", auth, async (req, res, next) => {
  try {
    const userInfo = req.user;

    if (!userInfo || !userInfo._id) {
      return res.status(401).json({ message: "Unauthorized user." });
    }

    if (!userInfo.isAdmin)
      return res
        .status(403)
        .json({ message: "Forbidden: Admin access required." });

    const { userId } = req.params;
    const mediaList = await getAllUserMediaById(userId);
    res.status(200).json(mediaList);
  } catch (error) {
    console.error("Error fetching user media:", error);
    next(error);
  }
});

// Admin: Delete all media for a user
router.delete("/user/:userId", auth, async (req, res, next) => {
  try {
    const userInfo = req.user;

    if (!userInfo || !userInfo._id) {
      return res.status(401).json({ message: "Unauthorized user." });
    }
    if (!userInfo.isAdmin)
      return res
        .status(403)
        .json({ message: "Forbidden: Admin access required." });

    const { userId } = req.params;
    await deleteAllUserMedia(userId);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting all user media:", error);
    next(error);
  }
});

module.exports = router;
