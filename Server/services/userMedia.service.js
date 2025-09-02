const { UserMedia } = require("../models/media/userMedia.model");
const { AppError } = require("../middlewares/errorHandler");
const { Types } = require("mongoose");
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
      _id: new Types.ObjectId(),
      user_id: userId,
      media_id: media.media_id,
      media_type: media.media_type || "unknown",
      media_title: media.media_title || "",
      overview: media.overview || "",
      cover_url: media.cover_url || "",
      status: media.status || "plan_to_watch",
      rating: media.rating || null,
      progress: media.progress || 0,
      progress_units: media.progress_units || "episodes",
      rewatch_count: media.rewatch_count || 0,
      is_favorite: media.is_favorite || false,
      started_date: media.started_date || new Date(),
      completed_date: media.completed_date || null,
      current_season: media.current_season || 0,
      current_episode: media.current_episode || 0,
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

async function getMediaById(mediaId, userId) {
  try {
    const media = await UserMedia.findOne({ _id: mediaId, user_id: userId });
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

    return mediaList;
  } catch (error) {
    throw new AppError(
      error.message,
      error.status || 500,
      "GET_USER_MEDIA_ERROR"
    );
  }
}

async function getUserMediaByStatus(userId, status) {
  try {
    const mediaList = await UserMedia.find({ user_id: userId, status })
      .sort({ createdAt: -1 })
      .lean();

    return mediaList;
  } catch (error) {
    throw new AppError(
      error.message,
      error.status || 500,
      "GET_MEDIA_BY_STATUS_ERROR"
    );
  }
}

async function getUserMediaByType(userId, mediaType) {
  try {
    const mediaList = await UserMedia.find({
      user_id: userId,
      media_type: mediaType,
    })
      .sort({ createdAt: -1 })
      .lean();

    return mediaList;
  } catch (error) {
    throw new AppError(
      error.message,
      error.status || 500,
      "GET_MEDIA_BY_TYPE_ERROR"
    );
  }
}

async function getMyUserMedia(userId) {
  try {
    const mediaList = await UserMedia.find({ user_id: userId })
      .sort({ createdAt: -1 })
      .lean();

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
  getUserMediaByStatus,
  getUserMediaByType,
  getMyUserMedia,
  updateMedia,
  deleteMedia,
  deleteAllUserMedia,
};
