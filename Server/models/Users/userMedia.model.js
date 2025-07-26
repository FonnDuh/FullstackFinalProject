const { Schema, model } = require("mongoose");

const userMediaSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    media_id: {
      type: String,
      required: true,
      index: true,
    },
    media_type: {
      type: String,
      enum: ["movie", "tv", "book", "anime", "game"],
    },
    media_title: {
      type: String,
      required: true,
      trim: true,
    },
    cover_url: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["watching", "completed", "plan_to_watch", "dropped", "on_hold"],
      default: "plan_to_watch",
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
      default: null,
    },
    progress: {
      type: Number,
      default: 0,
    },
    rewatch_count: {
      type: Number,
      default: 0,
    },
    is_favorite: {
      type: Boolean,
      default: false,
    },
    started_date: {
      type: Date,
    },
    completed_date: {
      type: Date,
    },
    // Optional TV tracking fields
    current_season: {
      type: Number,
      default: null,
    },
    current_episode: {
      type: Number,
      default: null,
    },
    last_watched_episode: {
      type: Number,
      default: null,
    },
    last_watched_season: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    versionKey: false,
  }
);

userMediaSchema.index({ user_id: 1, media_id: 1 }, { unique: true });

module.exports = { UserMedia: model("UserMedia", userMediaSchema) };
