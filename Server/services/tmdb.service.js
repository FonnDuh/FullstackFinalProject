const axios = require("axios");
const buildUrl = require("../utils/tmdbUriBuilder");
const { AppError } = require("../middlewares/errorHandler");
require("dotenv").config();

const API_KEY = process.env.TMDB_API_KEY;

async function fetchFromTmdb(endpoint, params = {}) {
  try {
    const url = buildUrl(endpoint, { ...params, api_key: API_KEY });

    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new AppError(
        "Failed to fetch data from TMDB",
        500,
        "TMDB_FETCH_ERROR"
      );
    }
    return response.data;
  } catch (error) {
    console.error("TMDB Request Error:", error.response?.data || error.message);
    throw new AppError(
      error.response?.data?.status_message || "Internal Server Error",
      error.response?.status || 500,
      "TMDB_REQUEST_ERROR"
    );
  }
}

module.exports = fetchFromTmdb;
