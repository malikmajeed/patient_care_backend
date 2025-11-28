const Joi = require('joi');

const createBookingSchema = Joi.object({
    booking_ID: Joi.string().length(6).optional(),
    booking_status: Joi.string().valid('pending', 'confirmed', 'completed', 'cancelled').required(),
    total_cost: Joi.number().required(),
    payment_status: Joi.string().valid('unpaid', 'paid', 'refunded').required(),
    booked_datetime: Joi.date().required(),
    invoice_ID: Joi.string().optional(),
    patient_ID: Joi.string().length(6).required(),
    nurse_ID: Joi.string().length(6).required()
});

const updateBookingSchema = Joi.object({
    booking_status: Joi.string().valid('pending', 'confirmed', 'completed', 'cancelled'),
    total_cost: Joi.number(),
    payment_status: Joi.string().valid('unpaid', 'paid', 'refunded'),
    booked_datetime: Joi.date(),
    invoice_ID: Joi.string(),
    patient_ID: Joi.string().length(6),
    nurse_ID: Joi.string().length(6)
}).min(1);

module.exports = {
    createBookingSchema,
    updateBookingSchema
};
