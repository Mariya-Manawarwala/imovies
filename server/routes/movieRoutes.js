const router = require("express").Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const c = require("../controllers/movieController");

router.get("/", c.list);
router.get("/:id", c.getOne);
router.post("/", auth("admin"), upload.single("poster"), c.create);
router.delete("/:id", auth("admin"), c.remove);

module.exports = router;
