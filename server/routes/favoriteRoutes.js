const router = require("express").Router();
const auth = require("../middleware/auth");
const c = require("../controllers/favoriteController");

router.get("/", auth("user"), c.mine);
router.post("/:movieId", auth("user"), c.toggle);

module.exports = router;
