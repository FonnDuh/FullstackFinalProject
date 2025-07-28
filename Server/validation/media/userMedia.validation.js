const { userMediaValidate } = require("./joi/userMediaValidate");

const userMediaValidation = (media) => {
  const { error } = userMediaValidate(media);
  if (error) return error.details.map((detail) => detail.message);
  return null;
};

module.exports = { userMediaValidation };
