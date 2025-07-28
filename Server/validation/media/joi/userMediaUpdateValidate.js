const Joi = require("joi");

const userMediaUpdateValidate = (update) => {
  const schema = Joi.object({
    _id: Joi.string().optional(),
    user_id: Joi.string().optional(),
    media_id: Joi.string().optional(),
    media_type: Joi.string()
      .valid("movie", "tv", "book", "anime", "game")
      .optional(),
    media_title: Joi.string().trim().optional(),
    cover_url: Joi.string().trim().optional(),
    overview: Joi.string().trim().optional(),
    status: Joi.string()
      .valid("watching", "completed", "plan_to_watch", "dropped", "on_hold")
      .optional(),
    rating: Joi.number().min(1).max(10).allow("").optional(),
    progress: Joi.number().optional(),
    progress_units: Joi.string()
      .valid("episodes", "chapters", "volumes", "minutes", "hours", "percent")
      .optional(),
    rewatch_count: Joi.number().optional(),
    is_favorite: Joi.boolean().optional(),
    started_date: Joi.date().allow(null).optional(),
    completed_date: Joi.date().allow(null).optional(),
    tv_tracking: Joi.object({
      current_season: Joi.number().allow(null).optional(),
      current_episode: Joi.number().allow(null).optional(),
      episode_watch_history: Joi.array()
        .items(
          Joi.object({
            episode_number: Joi.number().required(),
            season_number: Joi.number().required(),
            watched_at: Joi.date().required(),
          })
        )
        .optional(),
    }).optional(),
  });
  return schema.validate(update, { abortEarly: false });
};

module.exports = { userMediaUpdateValidate };
