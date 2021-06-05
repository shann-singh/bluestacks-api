const joi = require("joi");
const schemas = {
  /* checks the validity of username */
  username: joi.object().keys({
    userName: joi.string().min(4).max(30),
  }),
  /* new user sign-up schema */
  signup: joi.object().keys({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    userName: joi.string().required().min(4).max(30),
    email: joi.string().email().required(),
    password: joi.string().min(5).required(),
  }),
  /* user sign-in schema */
  signin: joi.object().keys({
    auth: [
      joi.string().email().required(),
      joi.string().required().min(4).max(30).required(),
    ],
    password: string(),
  }),
};

module.exports = schemas;
