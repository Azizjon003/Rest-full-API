const AppError = require("./AppError");

const catchAsync = (fn) => {
  return async (req, res, next) => {
    await fn(req, res, next).catch((err) => {
      console.log(err.statusCode);
      next(new AppError(err.message, err.statusCode));
    });
  };
};

module.exports = catchAsync;
