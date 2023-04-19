const router = require("express").Router();
const {
  getAllUsers,
  getUser,
  addUser,
  deleteUser,
  updateUser,
} = require("../controller/userController");
const { validate } = require("../controller/validationUser");
const {
  singUpJoi,
  loginJoi,
  updatePasswordJoi,
  userCreateJoi,
} = require("../validation/user");

router.route("/").get(getAllUsers).post(validate(userCreateJoi), addUser);
router.route("/:id").get(getUser).delete(deleteUser).patch(updateUser);

module.exports = router;
