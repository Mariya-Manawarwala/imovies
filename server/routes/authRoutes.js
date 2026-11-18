const router = require("express").Router();
const auth = require("../middleware/auth");
const { userAuth, me, updateMe } = require("../controllers/authController");

router.post("/register", userAuth.register);
router.post("/login", userAuth.login);
router.get("/me", auth(), me);
router.put("/me", auth(), updateMe);

module.exports = router;
