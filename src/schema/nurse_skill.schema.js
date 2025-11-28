const Joi = require('joi');

const createNurseSkillSchema = Joi.object({
    nurse_ID: Joi.string().length(6).required(),
    category_ID: Joi.string().length(6).required()
});

const updateNurseSkillSchema = Joi.object({
    nurse_ID: Joi.string().length(6),
    category_ID: Joi.string().length(6)
}).min(1);

module.exports = {
    createNurseSkillSchema,
    updateNurseSkillSchema
};
