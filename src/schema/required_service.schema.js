const Joi = require('joi');

const createRequiredServiceSchema = Joi.object({
    req_ID: Joi.string().length(6).required(),
    category_ID: Joi.string().length(6).required()
});

const updateRequiredServiceSchema = Joi.object({
    req_ID: Joi.string().length(6),
    category_ID: Joi.string().length(6)
}).min(1);

module.exports = {
    createRequiredServiceSchema,
    updateRequiredServiceSchema
};
