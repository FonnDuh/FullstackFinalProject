const Joi = require("joi");

const loginValidation = (user) => {
  const schema = Joi.object({
    email: Joi.string()
      .ruleset.regex(
         /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
      )
      .rule({
        message: "Email must be a valid email address.",
      })
      .required(),

    password: Joi.string()
      .ruleset.regex(
        /((?=.*\d{1})(?=.*[A-Z]{1})(?=.*[a-z]{1})(?=.*[!@#$%^&*-]{1}).{7,20})/
      )
      .rule({
        message:
          "Password must be between 7 and 20 characters long, and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
      })
      .required(),
  });
  return schema.validate(user, {
    abortEarly: false,
  });
};

module.exports = loginValidation;
