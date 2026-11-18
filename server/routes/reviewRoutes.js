const router = require("express").Router();
const auth = require("../middleware/auth");
const c = require("../controllers/reviewController");

router.get("/movie/:movieId", c.forMovie);
router.post("/", auth("user"), c.save);

module.exports = router;
