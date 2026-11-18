const router = require("express").Router();
const auth = require("../middleware/auth");
const c = require("../controllers/showController");

router.get("/admin", auth("admin"), c.adminList);
router.get("/movie/:movieId", c.forMovie);
router.get("/:id", auth(), c.getOne);
router.post("/", auth("admin"), c.create);
router.delete("/:id", auth("admin"), c.remove);

module.exports = router;
