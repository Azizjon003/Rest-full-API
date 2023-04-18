const AppError = require("./AppError");

const catchAsync = (fn) => {
  return async (req, res, next) => {
    await fn(req, res, next).catch((err) => {
      next(new AppError(err.message, err.statusCode));
    });
  };
};

module.exports = catchAsync;
