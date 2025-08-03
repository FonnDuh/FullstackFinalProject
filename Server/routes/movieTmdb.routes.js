const { Router } = require("express");
const router = Router();
const rateLimiter = require("../utils/rateLimiter.js");
const {
  getCachedData,
  setCachedData,
} = require("../services/cache.service.js");
const fetchFromTmdb = require("../services/tmdb.service.js");

router.get("/search", rateLimiter, async (req, res, next) => {
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
});

router.get("/popular", rateLimiter, async (req, res, next) => {
  const { page = 1 } = req.query;
  try {
    const data = await fetchFromTmdb("movie/popular", { page });
    res.json(data);
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Popular movies not found." });
    }
    next(error);
  }
});

router.get("/trending", rateLimiter, async (req, res, next) => {
  const { page = 1 } = req.query;
  try {
    const data = await fetchFromTmdb("trending/movie/day", { page });
    res.json(data);
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Trending movies not found." });
    }
    next(error);
  }
});

router.get("/upcoming", rateLimiter, async (req, res, next) => {
  const { page = 1 } = req.query;
  try {
    const data = await fetchFromTmdb("movie/upcoming", { page });
    res.json(data);
  } catch (error) {
    console.error("Error fetching upcoming movies:", error);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Upcoming movies not found." });
    }
    next(error);
  }
});

router.get("/genres", rateLimiter, async (req, res, next) => {
  const cacheKey = "movie_genres";
  try {
    const cached = await getCachedData(cacheKey);
    if (cached) {
      return res.json(cached);
    }
    const data = await fetchFromTmdb("genre/movie/list");

    await setCachedData(cacheKey, data, 3600);

    res.json(data);
  } catch (error) {
    console.error("Error fetching movie genres:", error);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Movie genres not found." });
    }
    next(error);
  }
});

router.get("/:id", rateLimiter, async (req, res, next) => {
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
});

router.get("/:id/recommendations", rateLimiter, async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }

  const cacheKey = `movie_recommendations:${id}`;
  try {
    const cached = await getCachedData(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const data = await fetchFromTmdb(`movie/${id}/recommendations`);

    await setCachedData(cacheKey, data, 3600);

    res.json(data);
  } catch (error) {
    console.error("Error fetching movie recommendations:", error);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Recommendations not found." });
    }
    next(error);
  }
});

router.get("/:id/credits", rateLimiter, async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }

  const cacheKey = `movie:${id}:credits`;
  try {
    const cached = await getCachedData(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const data = await fetchFromTmdb(`movie/${id}/credits`);

    await setCachedData(cacheKey, data, 3600);

    res.json(data);
  } catch (error) {
    console.error("Error fetching movie credits:", error);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Movie credits not found." });
    }
    next(error);
  }
});

module.exports = router;
