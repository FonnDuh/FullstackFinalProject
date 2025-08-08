const Joi = require("joi");

const registerValidation = (user) => {
  const schema = Joi.object({
    name: Joi.object()
      .keys({
        first: Joi.string().min(2).max(256).required(),
        last: Joi.string().min(2).max(256).required(),
      })
      .required(),

    email: Joi.string()
      .ruleset.regex(
        /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
      )
      .rule({
        message: "Email must be a valid email address",
      })
      .required(),
    username: Joi.string().min(3).max(50).required().trim(true).rule({
      message: "Username must be between 3 and 50 characters long",
    }),
    dateOfBirth: Joi.date()
      .ruleset.greater("1900-01-01")
      .rule({
        message: "Date of birth must be a valid date after 1900-01-01",
      })
      .less("now")
      .rule({
        message: "Date of birth must be a valid date in the past",
      })
      .required(),
    password: Joi.string()
      .ruleset.regex(
        /((?=.*\d{1})(?=.*[A-Z]{1})(?=.*[a-z]{1})(?=.*[!@#$%^&*-]{1}).{7,20})/
      )
      .rule({
        message:
          "Password must be between 7 and 20 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      })
      .required(),
    image_url: Joi.string()
      .ruleset.regex(
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
      )
      .rule({
        message: "Image URL must be a valid URL",
      })
      .allow("")
      .required(),
    isAdmin: Joi.boolean().allow(""),
  });

  return schema.validate(user, {
    abortEarly: false,
  });
};

module.exports = registerValidation;
