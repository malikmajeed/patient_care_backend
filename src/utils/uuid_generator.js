const { v4: uuidv4 } = require('uuid');
const Booking = require("../models/booking.model");
const Payment = require("../models/payment.model");
const ServiceCategory = require("../models/service_category.model");
const WorkSchedule = require("../models/work_schedule.model");
const Document = require("../models/document.model");
const CareRequirement = require("../models/care_requirement.model");
const Review = require("../models/review.model");

/**
 * Generate a unique UUID for a given model
 * @param {Object} model - Sequelize model
 * @param {string} idField - Primary key field name
 * @param {string} prefix - Prefix for the UUID (2 characters)
 * @returns {Promise<string>} - Generated UUID with prefix
 */
const generateUUID = async (model, idField, prefix) => {
    try {
        let isUnique = false;
        let generatedId = '';

        // Keep generating until we get a unique ID
        while (!isUnique) {
            // Generate a UUID and take first 4 characters
            const uuid = uuidv4().replace(/-/g, '').substring(0, 4).toUpperCase();
            generatedId = `${prefix}${uuid}`;

            // Check if this ID already exists
            const existingRecord = await model.findOne({
                where: { [idField]: generatedId }
            });

            if (!existingRecord) {
                isUnique = true;
            }
        }

        return generatedId;
    } catch (error) {
        throw new Error(`Error generating UUID for ${prefix}: ${error.message}`);
    }
};

/**
 * Generate unique booking ID
 * Format: BK + 4 random alphanumeric characters (e.g., BK3F2A)
 * @returns {Promise<string>}
 */
const generateBookingId = async () => {
    return await generateUUID(Booking, 'booking_ID', 'BK');
};

/**
 * Generate unique payment ID
 * Format: PY + 4 random alphanumeric characters (e.g., PY7B9C)
 * @returns {Promise<string>}
 */
const generatePaymentId = async () => {
    return await generateUUID(Payment, 'payment_ID', 'PY');
};

/**
 * Generate unique service category ID
 * Format: SC + 4 random alphanumeric characters (e.g., SC1D4E)
 * @returns {Promise<string>}
 */
const generateServiceCategoryId = async () => {
    return await generateUUID(ServiceCategory, 'category_ID', 'SC');
};

/**
 * Generate unique work schedule ID
 * Format: WS + 4 random alphanumeric characters (e.g., WS2E5F)
 * @returns {Promise<string>}
 */
const generateWorkScheduleId = async () => {
    return await generateUUID(WorkSchedule, 'work_id', 'WS');
};

/**
 * Generate unique document ID
 * Format: DC + 4 random alphanumeric characters (e.g., DC8G3H)
 * @returns {Promise<string>}
 */
const generateDocumentId = async () => {
    return await generateUUID(Document, 'doc_ID', 'DC');
};

/**
 * Generate unique care requirement ID
 * Format: CR + 4 random alphanumeric characters (e.g., CR4H6I)
 * @returns {Promise<string>}
 */
const generateCareRequirementId = async () => {
    return await generateUUID(CareRequirement, 'req_ID', 'CR');
};

/**
 * Generate unique review ID
 * Format: RV + 4 random alphanumeric characters (e.g., RV9J2K)
 * @returns {Promise<string>}
 */
const generateReviewId = async () => {
    return await generateUUID(Review, 'review_ID', 'RV');
};

module.exports = {
    generateBookingId,
    generatePaymentId,
    generateServiceCategoryId,
    generateWorkScheduleId,
    generateDocumentId,
    generateCareRequirementId,
    generateReviewId,
    generateUUID // Export the base function for custom use cases
};
