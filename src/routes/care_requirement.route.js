const express = require("express");
const router = express.Router();

const careRequirementController = require("../controllers/care_requirement.controller");

/**
 * @swagger
 * tags:
 *   name: Care Requirement
 *   description: Care requirement management
 */

/**
 * @swagger
 * /care-requirement:
 *   post:
 *     summary: Create a new care requirement
 *     tags: [Care Requirement]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - symptoms_problems
 *               - hours_per_day
 *               - date_time_of_service
 *               - patient_ID
 *             properties:
 *               req_ID:
 *                 type: string
 *                 maxLength: 6
 *               symptoms_problems:
 *                 type: string
 *               hours_per_day:
 *                 type: integer
 *               date_time_of_service:
 *                 type: string
 *                 format: date-time
 *               patient_ID:
 *                 type: string
 *                 maxLength: 6
 *     responses:
 *       201:
 *         description: Care requirement created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/", authenticate, careRequirementController.create);

/**
 * @swagger
 * /care-requirement:
 *   get:
 *     summary: Get all care requirements
 *     tags: [Care Requirement]
 *     responses:
 *       200:
 *         description: List of all care requirements
 *       500:
 *         description: Server error
 */
router.get("/", authenticate, careRequirementController.getAll);

/**
 * @swagger
 * /care-requirement/{id}:
 *   get:
 *     summary: Get care requirement by ID
 *     tags: [Care Requirement]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Care Requirement ID
 *     responses:
 *       200:
 *         description: Care requirement details
 *       404:
 *         description: Care requirement not found
 *       500:
 *         description: Server error
 */
// router.get("/:id", careRequirementController.getById);

/**
 * @swagger
 * /care-requirement/{id}:
 *   patch:
 *     summary: Update care requirement details
 *     tags: [Care Requirement]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Care Requirement ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               symptoms_problems:
 *                 type: string
 *               hours_per_day:
 *                 type: integer
 *               date_time_of_service:
 *                 type: string
 *                 format: date-time
 *               patient_ID:
 *                 type: string
 *                 maxLength: 6
 *     responses:
 *       200:
 *         description: Care requirement updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Care requirement not found
 *       500:
 *         description: Server error
 */
// router.patch("/:id", authenticate, careRequirementController.update);

/**
 * @swagger
 * /care-requirement/{id}:
 *   delete:
 *     summary: Delete care requirement
 *     tags: [Care Requirement]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Care Requirement ID
 *     responses:
 *       200:
 *         description: Care requirement deleted successfully
 *       404:
 *         description: Care requirement not found
 *       500:
 *         description: Server error
 */
// router.delete("/:id", careRequirementController.remove);

module.exports = router;


