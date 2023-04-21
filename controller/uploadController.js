const User = require("../model/user");
const AppError = require("../utility/AppError");
const catchAsync = require("../utility/catchAsync");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const uploadFileMiddleware = require("../utility/upload");
exports.upload = async (req, res, next) => {
  try {
    await uploadFileMiddleware(req, res);
    if (req.file == undefined) {
      const url =
        req.protocol + "://" + req.get("host") + "/uploads/" + "default.png";
      res.locals.imageUrl = url;
      req.imageUrl = url;

      return next();
    }
    const name = req.file.filename;
    const path = req.file.path;
    const size = req.file.size;
    const url = req.protocol + "://" + req.get("host") + "/uploads/" + name;
    console.log("url: " + url);
    res.locals.imageUrl = url;
    req.imageUrl = url;

    next();
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};
