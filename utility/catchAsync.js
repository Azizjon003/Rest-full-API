const AppError = require("./AppError");
const logger = require("./logger");
const catchAsync = (fn) => {
  return async (req, res, next) => {
    await fn(req, res, next).catch((err) => {
      logger.error(err);
      next(new AppError(err.message, err.statusCode));
    });
  };
};

module.exports = catchAsync;
