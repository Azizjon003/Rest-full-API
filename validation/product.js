const Joi = require("joi");

exports.productSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  salePrice: Joi.number().required(),
  description: Joi.string().required(),
  image: Joi.string().required(),
  category: Joi.string().required(),
  expire: Joi.date().required(),
});
