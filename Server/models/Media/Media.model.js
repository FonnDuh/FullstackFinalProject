const { Schema, model } = require("mongoose");

const episodeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    season: {
      type: Number,
      required: true,
    },
    episode_number: {
      type: Number,
      required: true,
    },
    air_date: {
      type: Date,
    },
  },
  { _id: false }
);

const mediaSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["movie", "tv", "book", "anime", "game"],
      required: true,
    },
    tmdb_id: {
      type: String,
      index: true,
    },
    language: {
      type: String,
    },
    country: {
      type: String,
    },
    popularity: {
      type: Number,
    },
    number_of_seasons: {
      type: Number,
    },
    number_of_episodes: {
      type: Number,
    },
    genres: [String],
    release_date: {
      type: Date,
    },
    poster_url: {
      type: String,
    },
    backdrop_url: {
      type: String,
    },
    description: {
      type: String,
    },
    external_id: {
      type: String,
    },
    rating: {
      type: Number,
    },
    average_rating: {
      type: Number,
    },
    vote_count: {
      type: Number,
    },
    duration: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["released", "upcoming", "ongoing"],
    },
    director: {
      type: String,
    },
    cast: [String],
    trailer_url: {
      type: String,
    },
    tags: [String],
    episodes: [episodeSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = { Media: model("Media", mediaSchema) };
