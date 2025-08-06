const { Router } = require("express");
const router = Router();
const rateLimiter = require("../../utils/rateLimiter.js");
const {
  getCachedData,
  setCachedData,
} = require("../../services/cache.service.js");
const fetchFromTmdb = require("../../services/tmdb.service.js");

router.get("/airing_today", rateLimiter, async (req, res, next) => {
  const { page = 1 } = req.query;
  try {
    const data = await fetchFromTmdb("tv/airing_today", { page });
    res.json(data);
  } catch (error) {
    console.error("Error fetching airing today series:", error);
    if (error.response && error.response.status === 404) {
      return res
        .status(404)
        .json({ message: "Airing today series not found." });
    }
    next(error);
  }
});

router.get("/on_the_air", rateLimiter, async (req, res, next) => {
  const { page = 1 } = req.query;
  try {
    const data = await fetchFromTmdb("tv/on_the_air", { page });
    res.json(data);
  } catch (error) {
    console.error("Error fetching on the air series:", error);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: "On the air series not found." });
    }
    next(error);
  }
});

router.get(
  "/:id/season/:season_number",
  rateLimiter,
  async (req, res, next) => {
    const { id, season_number } = req.params;
    if (!id || !season_number)
      return res
        .status(400)
        .json({ message: "ID and season_number parameters are required" });

    const cacheKey = `tv:${id}:season:${season_number}`;
    try {
      const cached = await getCachedData(cacheKey);
      if (cached) return res.json(cached);

      const data = await fetchFromTmdb(`tv/${id}/season/${season_number}`);

      await setCachedData(cacheKey, data, 3600);

      res.json(data);
    } catch (error) {
      console.error("Error fetching season details:", error);
      if (error.response && error.response.status === 404)
        return res.status(404).json({ message: "Season not found." });

      next(error);
    }
  }
);

router.get(
  "/:id/season/:season_number/episode/:episode_number",
  rateLimiter,
  async (req, res, next) => {
    const { id, season_number, episode_number } = req.params;
    if (!id || !season_number || !episode_number)
      return res.status(400).json({
        message:
          "ID, season_number, and episode_number parameters are required",
      });

    const cacheKey = `tv:${id}:season:${season_number}:episode:${episode_number}`;
    try {
      const cached = await getCachedData(cacheKey);
      if (cached) return res.json(cached);

      const data = await fetchFromTmdb(
        `tv/${id}/season/${season_number}/episode/${episode_number}`
      );

      await setCachedData(cacheKey, data, 3600);

      res.json(data);
    } catch (error) {
      console.error("Error fetching episode details:", error);
      if (error.response && error.response.status === 404)
        return res.status(404).json({ message: "Episode not found." });

      next(error);
    }
  }
);

module.exports = router;
