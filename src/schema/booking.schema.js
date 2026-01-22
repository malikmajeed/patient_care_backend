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

const createBookingRequestSchema = Joi.object({
    nurse_ID: Joi.string().length(6).required(),
    patient_ID: Joi.string().length(6).required(),
    service_category_ID: Joi.string().length(6).optional(),
    booking_date: Joi.date().required(),
    start_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    duration_hours: Joi.number().positive().required(),
    address_ID: Joi.number().integer().optional(),
    special_instructions: Joi.string().allow('').optional(),
    emergency_contact: Joi.string().optional()
});

const updateBookingSchema = Joi.object({
    booking_status: Joi.string().valid(
        'pending_nurse_approval',
        'confirmed',
        'in_progress',
        'completed',
        'cancelled_by_patient',
        'cancelled_by_nurse',
        'cancelled_by_admin'
    ),
    total_cost: Joi.number(),
    payment_status: Joi.string().valid('unpaid', 'paid', 'refunded'),
    booked_datetime: Joi.date(),
    invoice_ID: Joi.string(),
    patient_ID: Joi.string().length(6),
    nurse_ID: Joi.string().length(6),
    start_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    end_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    duration_hours: Joi.number().positive(),
    service_category_ID: Joi.string().length(6),
    address_ID: Joi.number().integer(),
    special_instructions: Joi.string().allow(''),
    emergency_contact: Joi.string()
}).min(1);

const updateBookingStatusSchema = Joi.object({
    status: Joi.string().valid(
        'pending_nurse_approval',
        'confirmed',
        'in_progress',
        'completed',
        'cancelled_by_patient',
        'cancelled_by_nurse',
        'cancelled_by_admin'
    ).required(),
    notes: Joi.string().allow('').optional()
});

module.exports = {
    createBookingSchema,
    createBookingRequestSchema,
    updateBookingSchema,
    updateBookingStatusSchema
};
