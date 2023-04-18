const express = require("express");
const app = express();

const authRouter = require("../routes/authRoute");
const userRoute = require("../routes/userRoute");
const ErrorHandler = require("../controller/errorHandler");
app.use(express.json());

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/users", userRoute);

app.use("/", async (req, res, next) => {
  res.send("Welcome to my app");
});
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(ErrorHandler);

module.exports = app;
