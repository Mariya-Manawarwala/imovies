const router = require("express").Router();
const auth = require("../middleware/auth");
const { pay } = require("../controllers/paymentController");

router.post("/", auth("user"), pay);

module.exports = router;
