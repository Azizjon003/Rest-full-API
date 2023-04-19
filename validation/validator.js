const Joi = require("joi");
const singUpValidator = (schema) => (peyload) =>
  schema.validate(peyload, {
    abortEarly: false,
  });

const singInSchema = Joi.object({
  name: Joi.string().min(5).required(),
  surname: Joi.string().min(5).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.ref("password"),
});

const loginValidator = (schema) => {
  let funct = (peyload) => {
    return schema.validate(peyload, {
      abortEarly: false,
    });
  };
  return funct;
};
let LoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const updatePasswordValidator = (schema) => (peyload) =>
  schema.validate(peyload, {
    abortEarly: false,
  });

const updatePasswordSchema = Joi.object({
  password: Joi.string().min(8).required(),
  passwordConfirm: Joi.ref("password"),
  passwordCurrent: Joi.string().min(8).required(),
});
exports.updatePasswordJoi = updatePasswordValidator(updatePasswordSchema);
exports.loginJoi = loginValidator(LoginSchema);
exports.singUpJoi = singUpValidator(singInSchema);