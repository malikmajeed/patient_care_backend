const Joi = require('joi');

const createUserSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).optional(), // Nurse doesn't use username
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    first_name: Joi.string().min(2).max(50).required(),
    last_name: Joi.string().min(2).max(50).required(),
    gender: Joi.string().valid('male', 'female', 'other').optional(),
    phone_number: Joi.string().optional(),
    profile_url: Joi.string().uri().optional().allow(null, '')
});

const loginUserSchema = Joi.object({
    username: Joi.string().optional(), // Can login with username or email
    email: Joi.string().email().optional(),
    password: Joi.string().required()
}).or('username', 'email');

const updateUserSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30),
    email: Joi.string().email(),
    password: Joi.string().min(6),
    first_name: Joi.string().min(2).max(50),
    last_name: Joi.string().min(2).max(50),
    gender: Joi.string().valid('male', 'female', 'other'),
    phone_number: Joi.string(),
    profile_url: Joi.string().uri().optional().allow(null, '')
}).min(1);

module.exports = {
    createUserSchema,
    loginUserSchema,
    updateUserSchema
};
