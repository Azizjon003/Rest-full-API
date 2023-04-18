const router = require("express").Router();

router.route("/login").get((req, res) => {
  res.send("Login page");
});

module.exports = router;
