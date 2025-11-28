const Joi = require('joi');

const createServiceCategorySchema = Joi.object({
    category_ID: Joi.string().length(6).optional(),
    category_name: Joi.string().required()
});

const updateServiceCategorySchema = Joi.object({
    category_name: Joi.string()
}).min(1);

module.exports = {
    createServiceCategorySchema,
    updateServiceCategorySchema
};
