const express = require("express");
const router = express.Router();

const workScheduleController = require("../controllers/work_schedule.controller");

/**
 * @swagger
 * tags:
 *   name: Work Schedule
 *   description: Work schedule management
 */

/**
 * @swagger
 * /work-schedule:
 *   post:
 *     summary: Create a new work schedule
 *     tags: [Work Schedule]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nurse_ID
 *               - day
 *               - time_range
 *             properties:
 *               work_id:
 *                 type: string
 *                 maxLength: 6
 *               nurse_ID:
 *                 type: string
 *                 maxLength: 6
 *               day:
 *                 type: string
 *                 enum: [monday, tuesday, wednesday, thursday, friday, saturday, sunday]
 *               time_range:
 *                 type: string
 *     responses:
 *       201:
 *         description: Work schedule created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/", workScheduleController.create);

/**
 * @swagger
 * /work-schedule:
 *   get:
 *     summary: Get all work schedules
 *     tags: [Work Schedule]
 *     responses:
 *       200:
 *         description: List of all work schedules
 *       500:
 *         description: Server error
 */
router.get("/", workScheduleController.getAll);

/**
 * @swagger
 * /work-schedule/{id}:
 *   get:
 *     summary: Get work schedule by ID
 *     tags: [Work Schedule]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Work Schedule ID
 *     responses:
 *       200:
 *         description: Work schedule details
 *       404:
 *         description: Work schedule not found
 *       500:
 *         description: Server error
 */
router.get("/:id", workScheduleController.getById);

/**
 * @swagger
 * /work-schedule/{id}:
 *   patch:
 *     summary: Update work schedule details
 *     tags: [Work Schedule]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Work Schedule ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nurse_ID:
 *                 type: string
 *                 maxLength: 6
 *               day:
 *                 type: string
 *                 enum: [monday, tuesday, wednesday, thursday, friday, saturday, sunday]
 *               time_range:
 *                 type: string
 *     responses:
 *       200:
 *         description: Work schedule updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Work schedule not found
 *       500:
 *         description: Server error
 */
router.patch("/:id", workScheduleController.update);

/**
 * @swagger
 * /work-schedule/{id}:
 *   delete:
 *     summary: Delete work schedule
 *     tags: [Work Schedule]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Work Schedule ID
 *     responses:
 *       200:
 *         description: Work schedule deleted successfully
 *       404:
 *         description: Work schedule not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", workScheduleController.remove);

module.exports = router;


