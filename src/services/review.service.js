const Review = require("../models/review.model");
const reviewSchema = require("../schema/review.schema");
const { generateReviewId } = require("../utils/uuid_generator");

// create review
const create = async (reviewData) => {
    try {
        const { error } = reviewSchema.createReviewSchema.validate(reviewData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        // Generate unique review ID
        const review_ID = await generateReviewId();

        const review = await Review.create({
            review_ID,
            ...reviewData
        });
        return review;
    } catch (error) {
        throw new Error(error.message);
    }
};

// get all reviews
const getAll = async () => {
    try {
        const reviews = await Review.findAll();
        return reviews;
    } catch (error) {
        throw new Error(error.message);
    }
};

// get by id
const getById = async (reviewId) => {
    try {
        const review = await Review.findByPk(reviewId);
        if (!review) {
            throw new Error("Review not found");
        }
        return review;
    } catch (error) {
        throw new Error(error.message);
    }
};

// update review
const update = async (reviewId, reviewData) => {
    try {
        const { error } = reviewSchema.updateReviewSchema.validate(reviewData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const review = await Review.findByPk(reviewId);
        if (!review) {
            throw new Error("Review not found");
        }

        await Review.update(reviewData, {
            where: { review_ID: reviewId }
        });

        const updated = await Review.findByPk(reviewId);
        return updated;
    } catch (error) {
        throw new Error(error.message);
    }
};

// delete review
const remove = async (reviewId) => {
    try {
        const deleted = await Review.destroy({
            where: { review_ID: reviewId }
        });
        if (!deleted) {
            throw new Error("Review not found");
        }
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove
};


