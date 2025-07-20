const express = require("express");
const router = express.Router();

const { searchTv } = require("./tv.controller");

router.get("/search", async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query)
      return res.status(400).json({ message: "Query parameter is required" });
    const results = await searchTv(query);

    res.json(results);
  } catch (err) {
    console.error("Error searching movie:", err);
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ message: "Show not found." });
    }
    next(err);
  }
});

module.exports = router;
