const Joi = require('joi');

const createPatientSchema = Joi.object({
    patient_ID: Joi.string().length(6).optional(),
    first_name: Joi.string().min(2).max(50).required(),
    last_name: Joi.string().min(2).max(50).required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone_number: Joi.string().required(),
    address: Joi.string().optional(),
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional()
});

const loginPatientSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const updatePatientSchema = Joi.object({
    first_name: Joi.string().min(2).max(50),
    last_name: Joi.string().min(2).max(50),
    gender: Joi.string().valid('male', 'female', 'other'),
    email: Joi.string().email(),
    password: Joi.string().min(6),
    phone_number: Joi.string(),
    address: Joi.string(),
    latitude: Joi.number(),
    longitude: Joi.number()
}).min(1);

module.exports = {
    createPatientSchema,
    loginPatientSchema,
    updatePatientSchema
};