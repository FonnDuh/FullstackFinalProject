const { AppError } = require("../../../middlewares/errorHandler.js");
const { searchMovieFromTMDB } = require("../../../services/movie.service.js");

async function searchMovie(name) {
  if (!name || typeof name !== "string") {
    throw new AppError("Invalid movie name", 400);
  }
  try {
    const results = await searchMovieFromTMDB(name);
    return results;
  } catch (err) {
    console.error("searchMovie failed:", err);
    throw new AppError("Could not search movie", 500);
  }
}

module.exports = { searchMovie };
