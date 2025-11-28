const Joi = require('joi');

const createReviewSchema = Joi.object({
    review_ID: Joi.string().length(6).optional(),
    rating_score: Joi.number().integer().min(1).max(5).required(),
    written_review: Joi.string().optional(),
    review_date: Joi.date().required(),
    patient_ID: Joi.string().length(6).required(),
    nurse_ID: Joi.string().length(6).required(),
    booking_ID: Joi.string().length(6).required()
});

const updateReviewSchema = Joi.object({
    rating_score: Joi.number().integer().min(1).max(5),
    written_review: Joi.string(),
    review_date: Joi.date(),
    patient_ID: Joi.string().length(6),
    nurse_ID: Joi.string().length(6),
    booking_ID: Joi.string().length(6)
}).min(1);

module.exports = {
    createReviewSchema,
    updateReviewSchema
};
