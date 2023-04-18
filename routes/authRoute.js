const router = require("express").Router();
const authController = require("../controller/authController");
router.route("/login").post(authController.login);

module.exports = router;
