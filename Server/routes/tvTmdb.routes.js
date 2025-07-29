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

  const cacheKey = `tv:${query}:${page}`;
  try {
    const cached = await getCachedData(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const data = await fetchFromTmdb("search/tv", {
      query,
      page,
    });

    await setCachedData(cacheKey, data, 3600);

    res.json(data);
  } catch (error) {
    console.error("Error searching shows:", error);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Show not found." });
    }
    next(error);
  }
});

router.get("/:id", rateLimiter, async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }

  const cacheKey = `tv:${id}`;
  try {
    const cached = await getCachedData(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const data = await fetchFromTmdb(`tv/${id}`);

    await setCachedData(cacheKey, data, 3600);

    res.json(data);
  } catch (error) {
    console.error("Error fetching show by ID:", error);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Show not found." });
    }
    next(error);
  }
});

router.get("/popular", rateLimiter, async (req, res, next) => {
  const { page = 1 } = req.query;
  try {
    const data = await fetchFromTmdb("tv/popular", { page });
    res.json(data);
  } catch (error) {
    console.error("Error fetching popular shows:", error);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Popular shows not found." });
    }
    next(error);
  }
});

router.get("/trending", rateLimiter, async (req, res, next) => {
  const { page = 1 } = req.query;
  try {
    const data = await fetchFromTmdb("trending/tv/day", { page });
    res.json(data);
  } catch (error) {
    console.error("Error fetching trending shows:", error);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Trending shows not found." });
    }
    next(error);
  }
});

router.get("/upcoming", rateLimiter, async (req, res, next) => {
  const { page = 1 } = req.query;
  try {
    const data = await fetchFromTmdb("tv/upcoming", { page });
    res.json(data);
  } catch (error) {
    console.error("Error fetching upcoming shows:", error);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Upcoming shows not found." });
    }
    next(error);
  }
});

router.get("/genres", rateLimiter, async (req, res, next) => {
  try {
    const data = await fetchFromTmdb("genre/tv/list");
    res.json(data);
  } catch (error) {
    console.error("Error fetching show genres:", error);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Show genres not found." });
    }
    next(error);
  }
});

// Get TV show recommendations
router.get("/:id/recommendations", rateLimiter, async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }

  const cacheKey = `tv_recommendations:${id}`;
  try {
    const cached = await getCachedData(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const data = await fetchFromTmdb(`tv/${id}/recommendations`);

    await setCachedData(cacheKey, data, 3600);

    res.json(data);
  } catch (error) {
    console.error("Error fetching TV recommendations:", error);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Recommendations not found." });
    }
    next(error);
  }
});

// Get TV show credits
router.get("/:id/credits", rateLimiter, async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }

  const cacheKey = `tv:${id}:credits`;
  try {
    const cached = await getCachedData(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const data = await fetchFromTmdb(`tv/${id}/credits`);

    await setCachedData(cacheKey, data, 3600);

    res.json(data);
  } catch (error) {
    console.error("Error fetching TV credits:", error);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "TV credits not found." });
    }
    next(error);
  }
});

router.get(
  "/:id/season/:season_number",
  rateLimiter,
  async (req, res, next) => {
    const { id, season_number } = req.params;
    if (!id || !season_number) {
      return res
        .status(400)
        .json({ message: "ID and season_number parameters are required" });
    }

    const cacheKey = `tv:${id}:season:${season_number}`;
    try {
      const cached = await getCachedData(cacheKey);
      if (cached) {
        return res.json(cached);
      }

      const data = await fetchFromTmdb(`tv/${id}/season/${season_number}`);

      await setCachedData(cacheKey, data, 3600);

      res.json(data);
    } catch (error) {
      console.error("Error fetching season details:", error);
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ message: "Season not found." });
      }
      next(error);
    }
  }
);

router.get(
  "/:id/season/:season_number/episode/:episode_number",
  rateLimiter,
  async (req, res, next) => {
    const { id, season_number, episode_number } = req.params;
    if (!id || !season_number || !episode_number) {
      return res.status(400).json({
        message:
          "ID, season_number, and episode_number parameters are required",
      });
    }
    const cacheKey = `tv:${id}:season:${season_number}:episode:${episode_number}`;
    try {
      const cached = await getCachedData(cacheKey);
      if (cached) {
        return res.json(cached);
      }

      const data = await fetchFromTmdb(
        `tv/${id}/season/${season_number}/episode/${episode_number}`
      );

      await setCachedData(cacheKey, data, 3600);

      res.json(data);
    } catch (error) {
      console.error("Error fetching episode details:", error);
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ message: "Episode not found." });
      }
      next(error);
    }
  }
);

module.exports = router;
