const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const AppError = require("../utility/AppError");
const authRouter = require("../routes/authRoute");
const userRoute = require("../routes/userRoute");
const productRoute = require("../routes/productRoute");
const CartRoute = require("../routes/cartRoute");
const ErrorHandler = require("../controller/errorHandler");
const cors = require("cors");

const { swaggerUI, swaggerDocument } = require("../controller/doc");
const morgan = require("morgan");

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "../public")));
app.use("/api/v1/auth", authRouter);

app.use("/api/v1/users", userRoute);

app.use("/api/v1/products", productRoute);

app.use("/api/v1/cart", CartRoute);
app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get("/", async (req, res, next) => {
  res.status(200).json({ message: "Welcome to my app" });
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(ErrorHandler);

module.exports = app;
