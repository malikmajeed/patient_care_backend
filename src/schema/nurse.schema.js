const Joi = require('joi');

const createNurseSchema = Joi.object({
    nurse_ID: Joi.string().length(6).optional(),
    first_name: Joi.string().min(2).max(50).required(),
    last_name: Joi.string().min(2).max(50).required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone_number: Joi.string().required(),
    address: Joi.string().optional(),
    verification_status: Joi.string().valid('pending', 'verified', 'rejected').default('pending'),
    experience_level: Joi.string().valid('beginner', 'intermediate', 'expert').required(),
    avg_rating: Joi.number().min(0).max(5).optional(),
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional(),
    current_availability: Joi.boolean().default(true)
});

const loginNurseSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const updateNurseSchema = Joi.object({
    first_name: Joi.string().min(2).max(50),
    last_name: Joi.string().min(2).max(50),
    gender: Joi.string().valid('male', 'female', 'other'),
    email: Joi.string().email(),
    password: Joi.string().min(6),
    phone_number: Joi.string(),
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
