const Joi = require("joi");

const userMovieValidate = (movie) => {
  const schema = Joi.object({
    user_id: Joi.string(),
    media_id: Joi.string().required(),
    media_type: Joi.string()
      .valid("movie", "tv", "book", "anime", "game")
      .required(),
    media_title: Joi.string().required().trim(),
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
    rewatch_count: Joi.number().default(0),
    is_favorite: Joi.boolean().default(false),
    started_date: Joi.date().allow(null),
    completed_date: Joi.date().allow(null),
    timestamps: Joi.object({
      created_at: Joi.date().default(Date.now),
      updated_at: Joi.date().default(Date.now),
    }),
  });
  return schema.validate(movie, { abortEarly: false });
};

module.exports = { userMovieValidate };
