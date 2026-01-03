const Joi = require('joi');

const createDocumentSchema = Joi.object({
    Doc_ID: Joi.string().length(6).optional(),
    nurse_ID: Joi.string().length(6).required(),
    url: Joi.string().uri().required(),
    type: Joi.string().valid('certification', 'diploma', 'other').required(),
    issuing_authority: Joi.string().required(),
    issue_date: Joi.date().required()
});

const updateDocumentSchema = Joi.object({
    nurse_ID: Joi.string().length(6),
    url: Joi.string().uri(),
    type: Joi.string().valid('certification', 'diploma', 'other'),
    issuing_authority: Joi.string(),
    issue_date: Joi.date()
}).min(1);

module.exports = {
    createDocumentSchema,
    updateDocumentSchema
};
