const Joi = require("joi");

const singInSchema = Joi.object({
  name: Joi.string().min(5).required(),
  surname: Joi.string().min(5).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.ref("password"),
  jins: Joi.string().required().valid("erkak", "ayol"),
});

let LoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const updatePasswordSchema = Joi.object({
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.ref("password"),
  passwordCurrent: Joi.string().min(8).required(),
});

const userCreateSchema = Joi.object({
  name: Joi.string().min(5).required(),
  surname: Joi.string().min(5).required(),
  email: Joi.string().email().required(),
  jins: Joi.string().required().valid("erkak", "ayol"),
});
exports.userCreateJoi = userCreateSchema;
exports.updatePasswordJoi = updatePasswordSchema;
exports.loginJoi = LoginSchema;
exports.singUpJoi = singInSchema;
