const router = require("express").Router();
const { adminAuth } = require("../controllers/authController");

router.post("/register", adminAuth.register);
router.post("/login", adminAuth.login);

module.exports = router;
