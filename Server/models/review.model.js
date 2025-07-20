const { Schema, model } =require ("mongoose");

const reviewSchema = new Schema(
  {
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
    parent_review_id: {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
    },
    title: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    is_spoiler: {
      type: Boolean,
      default: false,
    },
    helpful_votes: {
      type: Number,
      default: 0,
    },
    is_approved: {
      type: Boolean,
      default: true,
    },
    language: {
      type: String,
    },
    reported: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    liked_by: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    edited_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = { Review: model("Review", reviewSchema) };
