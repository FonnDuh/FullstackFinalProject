const express = require("express");
const router = express.Router();
const rateLimiter = require("../utils/rateLimiter.js");

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
  try {
    const data = await fetchFromTmdb("tv/popular");
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
  try {
    const data = await fetchFromTmdb("trending/tv/day");
    res.json(data);
  } catch (error) {
    console.error("Error fetching trending shows:", error);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "Trending shows not found." });
    }
    next(error);
  }
});

module.exports = router;
