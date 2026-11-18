const router = require("express").Router();
const auth = require("../middleware/auth");
const c = require("../controllers/bookingController");

router.get("/mine", auth("user"), c.mine);
router.get("/admin", auth("admin"), c.adminAll);

module.exports = router;
