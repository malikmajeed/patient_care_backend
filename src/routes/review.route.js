const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/review.controller");

/**
 * @swagger
 * tags:
 *   name: Review
 *   description: Review management
 */

/**
 * @swagger
 * /review:
 *   post:
 *     summary: Create a new review
 *     tags: [Review]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating_score
 *               - review_date
 *               - patient_ID
 *               - nurse_ID
 *               - booking_ID
 *             properties:
 *               review_ID:
 *                 type: string
 *                 maxLength: 6
 *               rating_score:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               written_review:
 *                 type: string
 *               review_date:
 *                 type: string
 *                 format: date-time
 *               patient_ID:
 *                 type: string
 *                 maxLength: 6
 *               nurse_ID:
 *                 type: string
 *                 maxLength: 6
 *               booking_ID:
 *                 type: string
 *                 maxLength: 6
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/", reviewController.create);

/**
 * @swagger
 * /review:
 *   get:
 *     summary: Get all reviews
 *     tags: [Review]
 *     responses:
 *       200:
 *         description: List of all reviews
 *       500:
 *         description: Server error
 */
router.get("/", reviewController.getAll);

/**
 * @swagger
 * /review/{id}:
 *   get:
 *     summary: Get review by ID
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review details
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.get("/:id", reviewController.getById);

/**
 * @swagger
 * /review/{id}:
 *   patch:
 *     summary: Update review details
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating_score:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               written_review:
 *                 type: string
 *               review_date:
 *                 type: string
 *                 format: date-time
 *               patient_ID:
 *                 type: string
 *                 maxLength: 6
 *               nurse_ID:
 *                 type: string
 *                 maxLength: 6
 *               booking_ID:
 *                 type: string
 *                 maxLength: 6
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.patch("/:id", reviewController.update);

/**
 * @swagger
 * /review/{id}:
 *   delete:
 *     summary: Delete review
 *     tags: [Review]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", reviewController.remove);

module.exports = router;


