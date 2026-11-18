const router = require("express").Router();
const auth = require("../middleware/auth");
const c = require("../controllers/theatreController");

router.get("/", auth("admin"), c.list);
router.post("/", auth("admin"), c.create);

module.exports = router;
