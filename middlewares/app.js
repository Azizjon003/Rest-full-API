const express = require("express");
const app = express();
const authRouter = require("../routes/authRoute");
app.use("/api/v1/auth", authRouter);
app.use("/", async (req, res, next) => {
  res.send("Welcome to my app");
});

module.exports = app;
