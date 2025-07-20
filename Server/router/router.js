const express = require("express");

const router = express.Router();

router.use("/movies", require("../modules/Media/Movies/movie.routes"));
router.use("/tv", require("../modules/Media/TV/tv.routes"));

module.exports = router;
