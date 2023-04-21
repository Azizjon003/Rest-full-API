const express = require("express");
const app = express();
const path = require("path");
const AppError = require("../utility/AppError");
const authRouter = require("../routes/authRoute");
const userRoute = require("../routes/userRoute");
const productRoute = require("../routes/productRoute");
const ErrorHandler = require("../controller/errorHandler");
const morgan = require("morgan");

app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "../public")));
app.use("/api/v1/auth", authRouter);

app.use("/api/v1/users", userRoute);

app.use("/api/v1/products", productRoute);

app.get("/", async (req, res, next) => {
  res.status(200).json({ message: "Welcome to my app" });
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(ErrorHandler);

module.exports = app;
