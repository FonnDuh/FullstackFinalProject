const { AppError } = require("../../../middlewares/errorHandler.js");
const { searchTvFromTMDB } = require("../../../services/tv.service.js");

async function searchTv(name) {
  if (!name || typeof name !== "string") {
    throw new AppError("Invalid show name", 400);
  }
  try {
    const results = await searchTvFromTMDB(name);
    return results;
  } catch (err) {
    console.error("searchTv failed:", err);
    throw new AppError("Could not search show", 500);
  }
}

module.exports = { searchTv };
