const Joi = require('joi');

const createWorkScheduleSchema = Joi.object({
    work_id: Joi.string().length(6).optional(),
    nurse_ID: Joi.string().length(6).required(),
    day: Joi.string().valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday').required(),
    time_range: Joi.string().required()
});

const updateWorkScheduleSchema = Joi.object({
    nurse_ID: Joi.string().length(6),
    day: Joi.string().valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
    time_range: Joi.string()
}).min(1);

module.exports = {
    createWorkScheduleSchema,
    updateWorkScheduleSchema
};
