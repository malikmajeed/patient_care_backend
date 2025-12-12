const Joi = require('joi');
const { createUserSchema, updateUserSchema, loginUserSchema } = require('./user.schema');

const createPatientSchema = createUserSchema.keys({
    patient_ID: Joi.string().length(6).optional(),
    // username: Joi.string().required(), // Patient requires username
    // gender: Joi.string().required(), // Patient requires gender
    // phone_number: Joi.string().required(), // Patient requires phone
    address: Joi.string().optional().allow(null, ''),
    latitude: Joi.number().optional().allow(null),
    longitude: Joi.number().optional().allow(null)
});

const loginPatientSchema = loginUserSchema; // Start with generic, but Patient might enforce username

const updatePatientSchema = updateUserSchema.keys({
    address: Joi.string().optional().allow(null, ''),
    latitude: Joi.number().optional().allow(null),
    longitude: Joi.number().optional().allow(null)
});

const patientSchema = {
    createPatientSchema,
    loginPatientSchema,
    updatePatientSchema
};

module.exports = patientSchema;