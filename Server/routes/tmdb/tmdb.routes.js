const { Router } = require("express");
const router = Router();
const rateLimiter = require("../../utils/rateLimiter.js");
const {
  getCachedData,
  setCachedData,
} = require("../../services/cache.service.js");
const fetchFromTmdb = require("../../services/tmdb.service.js");
const {
  isMediaType,
  isPopularType,
  isTrendingType,
  isBaseType,
} = require("../../constants/mediaTypes.js");

// Types: Collection, Company, Keyword, Movie, Tv, Multi, Person
router.get("/search/:type", rateLimiter, async (req, res, next) => {
  let { type } = req.params;
  if (!type)
    return res.status(400).json({ message: "Type parameter is required" });

  type = type.toLowerCase();

  if (!isMediaType(type))
    return res.status(400).json({ message: "Invalid type" });

  const { query, page = 1 } = req.query;
  if (!query)
    return res.status(400).json({ message: "Query parameter is required" });

  const cacheKey = `${type}:${query}:${page}`;
  try {
    const cached = await getCachedData(cacheKey);
    if (cached) return res.json(cached);

    const data = await fetchFromTmdb(`search/${type}`, {
      query,
      page,
    });

    await setCachedData(cacheKey, data, 3600);

    res.json(data);
  } catch (error) {
    console.error(`Error searching ${type}:`, error);
    if (error.response && error.response.status === 404)
      return res.status(404).json({ message: `${type} not found.` });

    next(error);
  }
});

// Types: Tv, Movie
router.get("/genre/:type", rateLimiter, async (req, res, next) => {
  let { type } = req.params;
  if (!type)
    return res.status(400).json({ message: "Type parameter is required" });

  type = type.toLowerCase();

  if (!isBaseType(type))
    return res.status(400).json({ message: "Invalid type" });

  const cacheKey = `media_genres_${type}`;
  try {
    const cached = await getCachedData(cacheKey);
    if (cached) return res.json(cached);

    const data = await fetchFromTmdb(`genre/${type}/list`);

    await setCachedData(cacheKey, data, 3600);

    res.json(data);
  } catch (error) {
    console.error(`Error fetching ${type} genres:`, error);
    if (error.response && error.response.status === 404)
      return res.status(404).json({ message: `${type} genres not found.` });

    next(error);
  }
});

// Types: Movie, Tv, Person
router.get("/popular/:type", rateLimiter, async (req, res, next) => {
  let { type } = req.params;
  if (!type)
    return res.status(400).json({ message: "Type parameter is required" });

  type = type.toLowerCase();

  if (!isPopularType(type))
    return res.status(400).json({ message: "Invalid type" });

  const { page = 1 } = req.query;
  try {
    const data = await fetchFromTmdb(`${type}/popular`, { page });
    res.json(data);
  } catch (error) {
    console.error(`Error fetching popular ${type}:`, error);
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: `Popular ${type} not found.` });
    }
    next(error);
  }
});

// Types: All, Movie, Tv, Person | Time: Day or Week
router.get(
  "/trending/:type/:timeWindow",
  rateLimiter,
  async (req, res, next) => {
    let { type } = req.params;
    const { timeWindow } = req.params;
    if (!type)
      return res.status(400).json({ message: "Type parameter is required" });

    type = type.toLowerCase();

    if (!isTrendingType(type))
      return res.status(400).json({ message: "Invalid type" });

    const { page = 1 } = req.query;
    try {
      const data = await fetchFromTmdb(`trending/${type}/${timeWindow}`, {
        page,
      });
      res.json(data);
    } catch (error) {
      console.error(`Error fetching trending ${type}:`, error);
      if (error.response && error.response.status === 404)
        return res.status(404).json({ message: `Trending ${type} not found.` });

      next(error);
    }
  }
);

// Types: Tv, Movie
router.get("/top_rated/:type", rateLimiter, async (req, res, next) => {
  let { type } = req.params;
  if (!type)
    return res.status(400).json({ message: "Type parameter is required" });

  type = type.toLowerCase();

  if (!isBaseType(type))
    return res.status(400).json({ message: "Invalid type" });

  const { page = 1 } = req.query;
  try {
    const data = await fetchFromTmdb(`${type}/top_rated`, { page });
    res.json(data);
  } catch (error) {
    console.error(`Error fetching top rated ${type}:`, error);
    if (error.response && error.response.status === 404)
      return res.status(404).json({ message: `Top rated ${type} not found.` });

    next(error);
  }
});

// Types: Movie, Tv, Person, Company, Collection, Keyword, Multi
router.get("/:type/:id", rateLimiter, async (req, res, next) => {
  let { type } = req.params;
  const { id } = req.params;
  if (!id || !type)
    return res
      .status(400)
      .json({ message: "ID and Type parameters are required" });

  type = type.toLowerCase();

  if (!isMediaType(type))
    return res.status(400).json({ message: "Invalid type" });

  const cacheKey = `${type}:${id}`;
  try {
    const cached = await getCachedData(cacheKey);
    if (cached) return res.json(cached);

    const data = await fetchFromTmdb(`${type}/${id}`);

    await setCachedData(cacheKey, data, 3600);

    res.json(data);
  } catch (error) {
    console.error(`Error fetching ${type} by ID:`, error);
    if (error.response && error.response.status === 404)
      return res.status(404).json({ message: `${type} not found.` });

    next(error);
  }
});

// Types: Tv, Movie
router.get(
  "/:type/:id/recommendations",
  rateLimiter,
  async (req, res, next) => {
    let { type } = req.params;
    const { id } = req.params;
    if (!id || !type)
      return res
        .status(400)
        .json({ message: "ID and Type parameters are required" });

    type = type.toLowerCase();

    if (!isBaseType(type))
      return res.status(400).json({ message: "Invalid type" });

    const cacheKey = `${type}_recommendations:${id}`;
    try {
      const cached = await getCachedData(cacheKey);
      if (cached) return res.json(cached);

      const data = await fetchFromTmdb(`${type}/${id}/recommendations`);

      await setCachedData(cacheKey, data, 3600);

      res.json(data);
    } catch (error) {
      console.error(`Error fetching ${type} recommendations:`, error);
      if (error.response && error.response.status === 404)
        return res.status(404).json({ message: `Recommendations not found.` });

      next(error);
    }
  }
);

// Types: Tv, Movie
router.get("/:type/:id/credits", rateLimiter, async (req, res, next) => {
  let { type } = req.params;
  const { id } = req.params;
  if (!id || !type)
    return res
      .status(400)
      .json({ message: "ID and Type parameters are required" });

  type = type.toLowerCase();

  if (!isBaseType(type))
    return res.status(400).json({ message: "Invalid type" });

  const cacheKey = `${type}:${id}:credits`;
  try {
    const cached = await getCachedData(cacheKey);
    if (cached) return res.json(cached);

    const data = await fetchFromTmdb(`${type}/${id}/credits`);

    await setCachedData(cacheKey, data, 3600);

    res.json(data);
  } catch (error) {
    console.error(`Error fetching ${type} credits:`, error);
    if (error.response && error.response.status === 404)
      return res.status(404).json({ message: `${type} credits not found.` });

    next(error);
  }
});

module.exports = router;
