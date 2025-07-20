const axios = require("axios");
require("dotenv").config();
const API_URL = process.env.TMDB_URL;
const HEADERS = {
  Authorization: process.env.TMDB_ACCESS_TOKEN,
  "Content-Type": "application/json",
};

async function searchTvFromTMDB(name) {
  const res = await axios.get(
    `${API_URL}/search/tv?query=${encodeURIComponent(name)}`,
    { headers: HEADERS }
  );
  if (res.status !== 200) {
    throw new Error("Failed to fetch show data");
  }
  return res.data.results;
}

module.exports = {
  searchTvFromTMDB,
};
