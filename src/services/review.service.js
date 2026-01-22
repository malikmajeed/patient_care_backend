const Review = require("../models/review.model");
const Booking = require("../models/booking.model");
const Nurse = require("../models/nurse.model");
const reviewSchema = require("../schema/review.schema");
const { generateReviewId } = require("../utils/uuid_generator.utils");

// calculate and update nurse rating
const calculateNurseRating = async (nurseId) => {
    try {
        const reviews = await Review.findAll({
            where: { nurse_ID: nurseId }
        });

        if (reviews.length === 0) {
            // Check if total_reviews column exists before updating
            const nurse = await Nurse.findByPk(nurseId);
            if (nurse) {
                const updateData = { avg_rating: 0 };
                // Only add total_reviews if column exists (for backward compatibility)
                try {
                    await Nurse.update(
                        { avg_rating: 0, total_reviews: 0 },
                        { where: { nurse_ID: nurseId } }
                    );
                } catch (err) {
                    // If total_reviews column doesn't exist, just update avg_rating
                    await Nurse.update(
                        { avg_rating: 0 },
                        { where: { nurse_ID: nurseId } }
                    );
                }
            }
            return { avg_rating: 0, total_reviews: 0 };
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating_score, 0);
        const avgRating = totalRating / reviews.length;
        const totalReviews = reviews.length;

        // Update nurse rating - handle case where total_reviews column might not exist
        try {
            await Nurse.update(
                { avg_rating: avgRating, total_reviews: totalReviews },
                { where: { nurse_ID: nurseId } }
            );
        } catch (err) {
            // If total_reviews column doesn't exist, just update avg_rating
            await Nurse.update(
                { avg_rating: avgRating },
                { where: { nurse_ID: nurseId } }
            );
        }

        return { avg_rating: avgRating, total_reviews: totalReviews };
    } catch (error) {
        throw new Error(`Failed to calculate nurse rating: ${error.message}`);
    }
};

// create review
const create = async (reviewData) => {
    try {
        const { error } = reviewSchema.createReviewSchema.validate(reviewData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        // Validate booking exists and is completed
        const booking = await Booking.findByPk(reviewData.booking_ID);
        if (!booking) {
            throw new Error('Booking not found');
        }

        if (booking.booking_status !== 'completed') {
            throw new Error('Can only review completed bookings');
        }

        // Check if review already exists for this booking
        const existingReview = await Review.findOne({
            where: { booking_ID: reviewData.booking_ID }
        });

        if (existingReview) {
            throw new Error('Review already exists for this booking');
        }

        // Verify booking belongs to the patient
        if (booking.patient_ID !== reviewData.patient_ID) {
            throw new Error('Invalid booking for this patient');
        }

        // Verify booking belongs to the nurse
        if (booking.nurse_ID !== reviewData.nurse_ID) {
            throw new Error('Invalid booking for this nurse');
        }

        // Generate unique review ID
        const review_ID = await generateReviewId();

        // Set review date to current date if not provided
        const review_date = reviewData.review_date || new Date();

        const review = await Review.create({
            review_ID,
            ...reviewData,
            review_date
        });

        // Recalculate nurse rating
        await calculateNurseRating(reviewData.nurse_ID);

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


