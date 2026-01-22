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

/**
 * @swagger
 * /work-schedules/bulk-update/{nurseId}:
 *   post:
 *     summary: Bulk update work schedules for a nurse
 *     tags: [Work Schedule]
 *     parameters:
 *       - in: path
 *         name: nurseId
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
 *               - schedules
 *             properties:
 *               schedules:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - day_of_week
 *                     - start_time
 *                     - end_time
 *                   properties:
 *                     day_of_week:
 *                       type: string
 *                       enum: [monday, tuesday, wednesday, thursday, friday, saturday, sunday]
 *                     start_time:
 *                       type: string
 *                       pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *                     end_time:
 *                       type: string
 *                       pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *     responses:
 *       200:
 *         description: Schedules updated successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/bulk-update/:nurseId", workScheduleController.bulkUpdate);

/**
 * @swagger
 * /work-schedules/nurse/{nurseId}:
 *   get:
 *     summary: Get work schedule for a nurse
 *     tags: [Work Schedule]
 *     parameters:
 *       - in: path
 *         name: nurseId
 *         schema:
 *           type: string
 *         required: true
 *         description: Nurse ID
 *     responses:
 *       200:
 *         description: Nurse schedule
 *       500:
 *         description: Server error
 */
router.get("/nurse/:nurseId", workScheduleController.getNurseSchedule);

/**
 * @swagger
 * /work-schedules/block-date/{nurseId}:
 *   post:
 *     summary: Block a specific date for a nurse
 *     tags: [Work Schedule]
 *     parameters:
 *       - in: path
 *         name: nurseId
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
 *               - date
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Date blocked successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/block-date/:nurseId", workScheduleController.blockDate);

module.exports = router;


