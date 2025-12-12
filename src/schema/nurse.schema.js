const Joi = require('joi');
const { createUserSchema, updateUserSchema, loginUserSchema } = require('./user.schema');

const createNurseSchema = createUserSchema.keys({
    nurse_ID: Joi.string().length(6).optional(),
    gender: Joi.string().required(), // Nurse requires gender
    phone_number: Joi.string().required(), // Nurse requires phone
    address: Joi.string().optional(),
    verification_status: Joi.string().valid('pending', 'verified', 'rejected').default('pending'),
    experience_level: Joi.string().valid('beginner', 'intermediate', 'expert').required(),
    avg_rating: Joi.number().min(0).max(5).optional(),
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional(),
    current_availability: Joi.boolean().default(true)
});

const loginNurseSchema = loginUserSchema; // Nurse login is generic

const updateNurseSchema = updateUserSchema.keys({
    address: Joi.string(),
    verification_status: Joi.string().valid('pending', 'verified', 'rejected'),
    experience_level: Joi.string().valid('beginner', 'intermediate', 'expert'),
    avg_rating: Joi.number().min(0).max(5),
    latitude: Joi.number(),
    longitude: Joi.number(),
    current_availability: Joi.boolean()
}).min(1);

module.exports = {
    createNurseSchema,
    loginNurseSchema,
    updateNurseSchema
};
