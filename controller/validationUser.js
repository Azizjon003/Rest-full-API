const catchAsync = require("../utility/catchAsync");
const logger = require("../utility/logger");
function validate(schema) {
  return catchAsync(async (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((err) => err.message);
      logger.error(errors);
      return res.status(400).json({ errors });
    }

    next();
  });
}
module.exports = { validate };
