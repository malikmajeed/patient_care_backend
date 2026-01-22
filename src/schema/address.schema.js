const Joi = require('joi');

const createAddressSchema = Joi.object({
    patient_ID: Joi.string().length(6).required(),
    label: Joi.string().max(50).allow('').optional(),
    house_number: Joi.string().max(50).allow('').optional(),
    street_address: Joi.string().max(200).required(),
    area: Joi.string().max(100).required(),
    landmark: Joi.string().max(200).allow('').optional(),
    postal_code: Joi.string().max(10).allow('').optional(),
    contact_person: Joi.string().max(100).allow('').optional(),
    contact_phone: Joi.string().max(20).allow('').optional(),
    is_default: Joi.boolean().default(false)
});

const updateAddressSchema = Joi.object({
    label: Joi.string().max(50).allow(''),
    house_number: Joi.string().max(50).allow(''),
    street_address: Joi.string().max(200),
    area: Joi.string().max(100),
    landmark: Joi.string().max(200).allow(''),
    postal_code: Joi.string().max(10).allow(''),
    contact_person: Joi.string().max(100).allow(''),
    contact_phone: Joi.string().max(20).allow(''),
    is_default: Joi.boolean()
}).min(1);

module.exports = {
    createAddressSchema,
    updateAddressSchema
};
