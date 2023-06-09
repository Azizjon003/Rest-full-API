const router = require("express").Router();
const authController = require("../controller/authController");
const { validate } = require("../controller/validationUser");
const {
  singUpJoi,
  loginJoi,
  updatePasswordJoi,
  userCreateJoi,
} = require("../validation/user");
const { upload } = require("../controller/uploadController");

router.route("/login").post(validate(loginJoi), authController.login);
router
  .route("/signup")
  .post(upload, validate(singUpJoi), authController.signUp);
router.route("/updatepassword").post(
  authController.protect,
  validate(updatePasswordJoi),

  authController.updatePassword
);
router.route("/logout").get(authController.protect, authController.logout);
router.route("/me").get(authController.protect, authController.me);

router
  .route("/updateme")
  .post(authController.protect, upload, authController.updateMe);
module.exports = router;
