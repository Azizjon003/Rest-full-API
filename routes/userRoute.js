const router = require("express").Router();
const {
  getAllUsers,
  getUser,
  addUser,
  deleteUser,
  updateUser,
} = require("../controller/userController");
const { validate } = require("../controller/validationUser");
const authController = require("../controller/authController");
const {
  singUpJoi,
  loginJoi,
  updatePasswordJoi,
  userCreateJoi,
} = require("../validation/user");

router
  .route("/")
  .get(authController.protect, authController.role("admin"), getAllUsers)
  .post(
    validate(userCreateJoi),
    authController.protect,
    authController.role("admin"),
    addUser
  );
router
  .route("/:id")
  .get(authController.protect, authController.role("admin"), getUser)
  .delete(authController.protect, authController.role("admin"), deleteUser)
  .patch(authController.protect, authController.role("admin"), updateUser);

module.exports = router;
