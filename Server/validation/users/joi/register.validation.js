const Joi = require("joi");

const registerValidation = (user) => {
  const minAge = 13;
  const today = new Date();
  const minBirthDate = new Date(
    today.getFullYear() - minAge,
    today.getMonth(),
    today.getDate()
  );

  const schema = Joi.object({
    name: Joi.object({
      first: Joi.string().min(2).max(256).required().messages({
        "string.base": "First name must be a string",
        "string.empty": "First name is required",
        "string.min": "First name must be at least 2 characters",
        "string.max": "First name must be at most 256 characters",
      }),

      last: Joi.string().min(2).max(256).required().messages({
        "string.base": "Last name must be a string",
        "string.empty": "Last name is required",
        "string.min": "Last name must be at least 2 characters",
        "string.max": "Last name must be at most 256 characters",
      }),
    }).required(),

    username: Joi.string()
      .trim()
      .pattern(/^[a-zA-Z0-9_]+$/)
      .min(3)
      .max(50)
      .required()
      .messages({
        "string.empty": "Username is required",
        "string.min": "Username must be at least 3 characters",
        "string.max": "Username must be at most 50 characters",
        "string.pattern.base":
          "Username can only contain letters, numbers, and underscores",
      }),

    email: Joi.string()
      .email({ tlds: { allow: false } })
      .min(5)
      .required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "Must be a valid email address",
        "string.min": "Email must be at least 5 characters",
      }),

    dateOfBirth: Joi.date()
      .less(minBirthDate)
      .required()
      .messages({
        "date.base": "Date of birth must be a valid date",
        "date.less": `You must be at least ${minAge} years old`,
        "any.required": "Date of birth is required",
      }),

    password: Joi.string()
      .pattern(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*\-_])[A-Za-z\d!@#$%^&*\-_]{7,20}$/
      )
      .required()
      .messages({
        "string.empty": "Password is required",
        "string.pattern.base":
          "Password must be 7–20 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*-_)",
      }),

    image_url: Joi.string().uri().min(14).allow("").messages({
      "string.uri": "Image URL must be a valid URL",
      "string.min": "Profile image URL must be at least 14 characters",
    }),

    isAdmin: Joi.boolean().default(false).messages({
      "boolean.base": "isAdmin must be a boolean value",
    }),
  });

  return schema.validate(user, {
    abortEarly: false,
  });
};

module.exports = registerValidation;
