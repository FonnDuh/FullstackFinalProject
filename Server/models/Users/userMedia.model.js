const { Schema, model } = require("mongoose");

const userMediaSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    media_id: {
      type: String,
      required: true,
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
    progress_units: {
      type: String,
      enum: ["episodes", "chapters", "volumes", "minutes", "hours", "percent"],
      default: "episodes",
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
      default: null,
    },
    completed_date: {
      type: Date,
      default: null,
    },
    // Optional TV tracking fields
    tv_tracking: {
      current_season: {
        type: Number,
        default: null,
      },
      current_episode: {
        type: Number,
        default: null,
      },
      episode_watch_history: [
        {
          episode_number: Number,
          season_number: Number,
          watched_at: Date,
        },
      ],
      default: [],
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
