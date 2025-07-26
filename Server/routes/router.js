const router = require("express").Router();

router.use("/movie", require("./movieTmdb.routes"));
router.use("/tv", require("./tvTmdb.routes"));
router.use("/media", require("./media.routes"));
router.use("/user", require("./user.routes"));

module.exports = router;
