const DEFAULT_VALIDATION = {
  type: String,
  minLength: 2,
  maxLength: 256,
  required: true,
  trim: true,
};

const EMAIL = {
  type: String,
  match: RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/),
  required: true,
  lowercase: true,
  trim: true,
};

const URL = {
  type: String,
  match: RegExp(
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/
  ),
  lowercase: true,
  trim: true,
  lowercase: true,
  required: false,
};

module.exports = { DEFAULT_VALIDATION, EMAIL, URL };
