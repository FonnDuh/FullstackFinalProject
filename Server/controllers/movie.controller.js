// DEPRECATED: This file is no longer used in the project.

const fetchFromTmdb = require("../services/tmdb.service.js");
const {
  getCachedData,
  setCachedData,
} = require("../services/cache.service.js");

async function searchMovie(req, res, next) {
  const { query, page = 1 } = req.query;
  if (!query) {
    return res.status(400).json({ message: "Query parameter is required" });
  }

  const cacheKey = `movie_search:${query}:${page}`;
  try {
    const cached = await getCachedData(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const data = await fetchFromTmdb("search/movie", {
      query,
      page,
    });

    await setCachedData(cacheKey, data, 3600);

    res.json(data);
  } catch (error) {
    console.error("Error searching Movie:", error);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Movie not found." });
    }
    next(error);
  }
}

async function searchMovieDetails(req, res, next) {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }

  const cacheKey = `movie:${id}`;
  try {
    const cached = await getCachedData(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const data = await fetchFromTmdb(`movie/${id}`);

    await setCachedData(cacheKey, data, 3600);

    res.json(data);
  } catch (error) {
    console.error("Error fetching Movie by ID:", error);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Movie not found." });
    }
    next(error);
  }
}

async function getPopularMovies(req, res, next) {
  try {
    const data = await fetchFromTmdb("movie/popular");
    res.json(data);
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Popular movies not found." });
    }
    next(error);
  }
}

async function getTrendingMovies(req, res, next) {
  try {
    const data = await fetchFromTmdb("trending/movie/day");
    res.json(data);
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Trending movies not found." });
    }
    next(error);
  }
}

module.exports = { searchMovie, searchMovieDetails, getPopularMovies, getTrendingMovies };
