const { Router } = require("express");
const router = Router();
const rateLimiter = require("../../utils/rateLimiter.js");
const fetchFromTmdb = require("../../services/tmdb.service.js");

router.get("/now_playing", rateLimiter, async (req, res, next) => {
  const { page = 1 } = req.query;
  try {
    const data = await fetchFromTmdb("movie/now_playing", { page });
    res.json(data);
  } catch (error) {
    console.error("Error fetching now playing movies:", error);
    if (error.response && error.response.status === 404)
      return res.status(404).json({ message: "Now playing movies not found." });

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
    if (error.response && error.response.status === 404)
      return res.status(404).json({ message: "Upcoming movies not found." });

    next(error);
  }
});

module.exports = router;
