const Joi = require("joi");

exports.productSchema = Joi.object({
  name: Joi.string().length(3).required(),
  price: Joi.number().required(),
  salePrice: Joi.number().required(),
  description: Joi.string().length(30).required(),
  image: Joi.string().required(),
  category: Joi.string().required(),
  expire: Joi.date().required(),
});
