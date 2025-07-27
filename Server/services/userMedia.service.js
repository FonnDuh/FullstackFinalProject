const { UserMedia } = require("../models/Users/userMedia.model");
const { AppError } = require("../middlewares/errorHandler");
require("dotenv").config();

async function createMedia(media, userId) {
  try {
    const existingMedia = await UserMedia.findOne({
      user_id: userId,
      media_id: media.media_id,
    });

    if (existingMedia) {
      throw new AppError(
        "Media already exists for this user",
        400,
        "MEDIA_EXISTS"
      );
    }

    const newMedia = new UserMedia({
      user_id: userId,
      media_id: media.media_id,
      media_type: media.media_type,
      media_title: media.media_title,
      cover_url: media.cover_url,
      status: media.status || "plan_to_watch",
      rating: media.rating || null,
      progress: media.progress || 0,
      progress_units: media.progress_units || "episodes",
      rewatch_count: media.rewatch_count || 0,
      is_favorite: media.is_favorite || false,
      started_date: media.started_date || null,
      completed_date: media.completed_date || null,
      current_season: media.current_season || null,
      current_episode: media.current_episode || null,
      episode_watch_history: media.episode_watch_history || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await newMedia.save();
  } catch (error) {
    throw new AppError(
      error.message,
      error.status || 500,
      "CREATE_MEDIA_ERROR"
    );
  }
}

async function getMediaById(mediaId) {
  try {
    const media = await UserMedia.findById(mediaId).lean();
    if (!media) {
      throw new AppError("Media not found", 404, "MEDIA_NOT_FOUND");
    }
    return media;
  } catch (error) {
    throw new AppError(
      error.message,
      error.status || 500,
      "GET_MEDIA_BY_ID_ERROR"
    );
  }
}

async function getAllUserMediaById(userId) {
  try {
    const mediaList = await UserMedia.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .lean();

    if (!mediaList || mediaList.length === 0) {
      throw new AppError("No media found for this user", 404, "NO_MEDIA_FOUND");
    }

    return mediaList;
  } catch (error) {
    throw new AppError(
      error.message,
      error.status || 500,
      "GET_USER_MEDIA_ERROR"
    );
  }
}

async function getMyUserMedia(userId) {
  try {
    const mediaList = await UserMedia.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .lean();
    if (!mediaList || mediaList.length === 0) {
      throw new AppError("No media found for this user", 404, "NO_MEDIA_FOUND");
    }
    return mediaList;
  } catch (error) {
    throw new AppError(
      error.message,
      error.status || 500,
      "GET_USER_MEDIA_ERROR"
    );
  }
}

async function updateMedia(mediaId, userId, updates) {
  try {
    const media = await UserMedia.findOneAndUpdate(
      { _id: mediaId, user_id: userId },
      updates,
      { new: true }
    );
    if (!media) {
      throw new AppError(
        "Media not found or you do not have permission",
        404,
        "MEDIA_NOT_FOUND"
      );
    }
    return media;
  } catch (error) {
    throw new AppError(
      error.message,
      error.status || 500,
      "UPDATE_MEDIA_ERROR"
    );
  }
}

async function deleteMedia(mediaId, userId) {
  try {
    const media = await UserMedia.findOneAndDelete({
      _id: mediaId,
      user_id: userId,
    });
    if (!media) {
      throw new AppError(
        "Media not found or you do not have permission",
        404,
        "MEDIA_NOT_FOUND"
      );
    }
    return media;
  } catch (error) {
    throw new AppError(
      error.message,
      error.status || 500,
      "DELETE_MEDIA_ERROR"
    );
  }
}

async function deleteAllUserMedia(userId) {
  try {
    const deletedMedia = await UserMedia.deleteMany({ user_id: userId });
    if (deletedMedia.deletedCount === 0) {
      throw new AppError("No media found for this user", 404, "NO_MEDIA_FOUND");
    }
    return deletedMedia;
  } catch (error) {
    throw new AppError(
      error.message || "Error deleting user media.",
      500,
      "DELETE_USER_MEDIA_ERROR"
    );
  }
}

module.exports = {
  createMedia,
  getMediaById,
  getAllUserMediaById,
  getMyUserMedia,
  updateMedia,
  deleteMedia,
  deleteAllUserMedia,
};
