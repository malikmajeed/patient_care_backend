const Joi = require('joi');

const createCareRequirementSchema = Joi.object({
    req_ID: Joi.string().length(6).optional(),
    symptoms_problems: Joi.string().required(),
    hours_per_day: Joi.number().integer().required(),
    date_time_of_service: Joi.date().required(),
    patient_ID: Joi.string().length(6).required()
});

const updateCareRequirementSchema = Joi.object({
    symptoms_problems: Joi.string(),
    hours_per_day: Joi.number().integer(),
    date_time_of_service: Joi.date(),
    patient_ID: Joi.string().length(6)
}).min(1);

module.exports = {
    createCareRequirementSchema,
    updateCareRequirementSchema
};
