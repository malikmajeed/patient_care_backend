const express = require("express");
const router = express.Router();

const nurseController = require("../controllers/nurse.controller");

/**
 * @swagger
 * tags:
 *   name: Nurse
 *   description: Nurse management
 */



/**
 * @swagger
 * /nurse/update/{id}:
 *   patch:
 *     summary: Update nurse details
 *     tags: [Nurse]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Nurse ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               last_name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               phone_number:
 *                 type: string
 *               address:
 *                 type: string
 *               verification_status:
 *                 type: string
 *                 enum: [pending, verified, rejected]
 *               experience_level:
 *                 type: string
 *                 enum: [beginner, intermediate, expert]
 *               avg_rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               current_availability:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Nurse updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Nurse not found
 *       500:
 *         description: Server error
 */
router.patch("/update/:id", nurseController.update);

/**
 * @swagger
 * /nurse/{id}:
 *   get:
 *     summary: Get nurse by ID
 *     tags: [Nurse]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Nurse ID
 *     responses:
 *       200:
 *         description: Nurse details
 *       404:
 *         description: Nurse not found
 *       500:
 *         description: Server error
 */
// Search route must come before /:id route to avoid matching "search" as an ID
router.get("/search", nurseController.searchNurses);

router.get("/:id", nurseController.getById);

/**
 * @swagger
 * /nurse/{id}/availability:
 *   get:
 *     summary: Get nurse availability for a specific date
 *     tags: [Nurse]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Nurse ID
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Availability information
 *       400:
 *         description: Missing date parameter
 *       500:
 *         description: Server error
 */
router.get("/:id/availability", nurseController.getAvailability);

/**
 * @swagger
 * /nurse/search:
 *   get:
 *     summary: Search nurses with filters
 *     tags: [Nurse]
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Location/area filter
 *       - in: query
 *         name: skills
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Service category IDs
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Check availability for this date
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum hourly rate
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum hourly rate
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *         description: Minimum rating
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [male, female, other]
 *         description: Gender preference
 *       - in: query
 *         name: verifiedOnly
 *         schema:
 *           type: boolean
 *         description: Show only verified nurses
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Results per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [rating, price, experience]
 *           default: rating
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Search results
 *       500:
 *         description: Server error
 */
// Search route moved above /:id route to avoid route conflicts

/**
 * @swagger
 * /nurse:
 *   get:
 *     summary: Get all nurses
 *     tags: [Nurse]
 *     responses:
 *       200:
 *         description: List of all nurses
 *       500:
 *         description: Server error
 */
router.get("/", nurseController.getAll);

/**
 * @swagger
 * /nurse/{id}:
 *   delete:
 *     summary: Delete nurse
 *     tags: [Nurse]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Nurse ID
 *     responses:
 *       200:
 *         description: Nurse deleted successfully
 *       404:
 *         description: Nurse not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", nurseController.remove);

/**
 * @swagger
 * /nurses/{id}/verification:
 *   patch:
 *     summary: Update nurse verification status
 *     tags: [Nurse]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Nurse ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [verified, rejected, pending]
 *               admin_notes:
 *                 type: string
 *               rejection_reason:
 *                 type: string
 *               required_documents:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Verification status updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Nurse not found
 *       500:
 *         description: Server error
 */
router.patch("/:id/verification", nurseController.updateVerificationStatus);

module.exports = router;
