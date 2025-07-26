require("dotenv").config();
const BASE_URL = process.env.TMDB_URL;

function buildUrl(endpoint, params = {}) {
  const url = new URL(BASE_URL + endpoint);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) url.searchParams.set(key, value);
  });
  return url.toString();
}

module.exports = buildUrl;
