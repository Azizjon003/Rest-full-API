const router = require("express").Router();
const {
  getAllUsers,
  getUser,
  addUser,
  deleteUser,
  updateUser,
} = require("../controller/userController");
router.route("/").get(getAllUsers).post(addUser);
router.route("/:id").get(getUser).delete(deleteUser).patch(updateUser);

module.exports = router;
