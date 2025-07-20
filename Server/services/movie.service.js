const axios = require("axios");
require("dotenv").config();
const API_URL = process.env.TMDB_URL;
const HEADERS = {
  Authorization: process.env.TMDB_ACCESS_TOKEN,
  "Content-Type": "application/json",
};

async function searchMovieFromTMDB(name) {
  const res = await axios.get(
    `${API_URL}/search/movie?query=${encodeURIComponent(name)}`,
    {
      headers: HEADERS,
    }
  );
  if (res.status !== 200) {
    throw new Error("Failed to fetch movie data");
  }
  return res.data.results;
}

module.exports = {
  searchMovieFromTMDB,
};
