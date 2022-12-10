const Joi = require('joi');

const registrationUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(15),
    subscription: Joi.string().valid("starter", "pro", "business").optional(),
    token: Joi.string()
});

const loginUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(15),
});

const verifySchema = Joi.object({
    email: Joi.string().email().required(),
});

module.exports = { registrationUserSchema, loginUserSchema, verifySchema };
