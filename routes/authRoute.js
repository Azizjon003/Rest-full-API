const router = require("express").Router();
const authController = require("../controller/authController");
router.route("/login").post(authController.login);
router.route("/signup").post(authController.signUp);
router
  .route("/updatepassword")
  .post(authController.protect, authController.updatePassword);
router.route("/logout").get(authController.logout);

router.route("/updateme").post(authController.protect, authController.updateMe);
module.exports = router;
