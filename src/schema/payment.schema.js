const Joi = require('joi');

const createPaymentSchema = Joi.object({
    payment_ID: Joi.string().length(6).optional(),
    transaction_date: Joi.date().required(),
    amount: Joi.number().positive().required(),
    payment_method: Joi.string().valid('card', 'cash', 'bank_transfer', 'wallet').required(),
    status: Joi.string().valid('pending', 'successful', 'failed').required(),
    transaction_details: Joi.string().optional(),
    booking_ID: Joi.string().length(6).required()
});

const updatePaymentSchema = Joi.object({
    transaction_date: Joi.date(),
    amount: Joi.number().positive(),
    payment_method: Joi.string().valid('card', 'cash', 'bank_transfer', 'wallet'),
    status: Joi.string().valid('pending', 'successful', 'failed'),
    transaction_details: Joi.string(),
    booking_ID: Joi.string().length(6)
}).min(1);

module.exports = {
    createPaymentSchema,
    updatePaymentSchema
};
