const { Schema, model } = require("mongoose");

const userMediaSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  media_id: {
    type: Schema.Types.ObjectId,
    ref: "Media",
    required: true,
    index: true,
  },
  media_type: {
    type: String,
    enum: ["movie", "tv", "book", "anime", "game"],
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
  },
  progress: {
    type: Number,
    default: 0,
  },
  last_watched_episode: {
    type: Number,
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
  notes: {
    type: String,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = { UserMedia: model("UserMedia", UserMediaSchema) };
