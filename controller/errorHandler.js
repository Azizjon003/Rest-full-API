const winston = require("winston");
const logger = require("../utility/logger");
module.exports = (err, req, res, next) => {
  console.log(err);
  if (req.originalUrl.startsWith("/api")) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    err.message = err.message;
    logger.error(
      JSON.stringify({
        status: err.status,
        statusCode: err.statusCode,
        message: err.message,
        infoError: err.stack,
      })
    );
    res.status(err.statusCode).json({
      status: err.status,
      statusCode: err.statusCode,
      message: err.message,
      infoError: err.stack,
    });
  } else {
    res.status(err.statusCode || 500).json({
      message: err.message,
    });
  }
};
