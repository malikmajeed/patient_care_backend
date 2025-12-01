const Joi = require('joi');

const createPatientSchema = Joi.object({
    patient_ID: Joi.string().length(6).optional(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone_number: Joi.string().required(),
    profile_url: Joi.string().uri().optional().allow(null, ''),
    address: Joi.string().optional().allow(null, ''),
    latitude: Joi.number().optional().allow(null),
    longitude: Joi.number().optional().allow(null)
});

const loginPatientSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

const updatePatientSchema = Joi.object({
    first_name: Joi.string(),
    last_name: Joi.string(),
    username: Joi.string().alphanum().min(3).max(30),
    gender: Joi.string().valid('male', 'female', 'other'),
    email: Joi.string().email(),
    password: Joi.string().min(6),
    phone_number: Joi.string(),
    profile_url: Joi.string().uri().optional().allow(null, ''),
    address: Joi.string().optional().allow(null, ''),
    latitude: Joi.number().optional().allow(null),
    longitude: Joi.number().optional().allow(null)
}).min(1);

const patientSchema = {
    createPatientSchema,
    loginPatientSchema,
    updatePatientSchema
};

module.exports = patientSchema;