const { Router } = require("express");
const router = Router();

router.use("/movie", require("./movieTmdb.routes"));
router.use("/tv", require("./tvTmdb.routes"));
router.use("/media", require("./userMedia.routes"));
router.use("/user", require("./user.routes"));

module.exports = router;
