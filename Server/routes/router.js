const { Router } = require("express");
const router = Router();

router.use("/tmdb", require("./tmdb/tmdb.routes"));
router.use("/tmdb/movie", require("./tmdb/movieTmdb.routes"));
router.use("/tmdb/tv", require("./tmdb/tvTmdb.routes"));
router.use("/media", require("./userMedia.routes"));
router.use("/user", require("./user.routes"));

module.exports = router;
