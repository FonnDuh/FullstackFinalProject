const Joi = require("joi");

const userMediaValidate = (movie) => {
  const schema = Joi.object({
    _id: Joi.string().optional(),
    user_id: Joi.string().required(),
    media_id: Joi.string().required(),
    media_type: Joi.string()
      .valid("movie", "tv", "book", "anime", "game")
      .required(),
    media_title: Joi.string().required().trim(),
    overview: Joi.string().required().trim(),
    cover_url: Joi.string().required().trim(),
    status: Joi.string()
      .valid("watching", "completed", "plan_to_watch", "dropped", "on_hold")
      .default("plan_to_watch"),
    rating: Joi.number()
      .min(1)
      .max(10)
      .rule({ message: "Rating must be between 1 to 10" })
      .allow(""),
    progress: Joi.number().default(0),
    progress_units: Joi.string()
      .valid("episodes", "chapters", "volumes", "minutes", "hours", "percent")
      .default("episodes"),
    rewatch_count: Joi.number().default(0),
    is_favorite: Joi.boolean().default(false),
    started_date: Joi.date().allow(null),
    completed_date: Joi.date().allow(null),
    tv_tracking: Joi.object({
      current_season: Joi.number().allow(null),
      current_episode: Joi.number().allow(null),
      episode_watch_history: Joi.array()
        .items(
          Joi.object({
            episode_number: Joi.number().required(),
            season_number: Joi.number().required(),
            watched_at: Joi.date().required(),
          })
        )
        .default([]),
    }).optional(),
    timestamps: Joi.object({
      created_at: Joi.date().default(Date.now),
      updated_at: Joi.date().default(Date.now),
    }),
  });
  return schema.validate(movie, { abortEarly: false });
};

module.exports = { userMediaValidate };
