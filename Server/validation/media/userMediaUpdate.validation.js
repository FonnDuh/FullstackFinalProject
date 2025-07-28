const { userMediaUpdateValidate } = require("./joi/userMediaUpdateValidate");

const userMediaUpdateValidation = (media) => {
  const { error } = userMediaUpdateValidate(media);
  if (error) return error.details.map((detail) => detail.message);
  return null;
};

module.exports = { userMediaUpdateValidation };
