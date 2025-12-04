const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/booking.controller");

/**
 * @swagger
 * tags:
 *   name: Booking
 *   description: Booking management
 */

/**
 * @swagger
 * /booking:
 *   post:
 *     summary: Create a new booking
 *     tags: [Booking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - booking_status
 *               - total_cost
 *               - payment_status
 *               - booked_datetime
 *               - patient_ID
 *               - nurse_ID
 *             properties:
 *               booking_ID:
 *                 type: string
 *                 maxLength: 6
 *               booking_status:
 *                 type: string
 *                 enum: [pending, confirmed, completed, cancelled]
 *               total_cost:
 *                 type: number
 *               payment_status:
 *                 type: string
 *                 enum: [unpaid, paid, refunded]
 *               booked_datetime:
 *                 type: string
 *                 format: date-time
 *               invoice_ID:
 *                 type: string
 *               patient_ID:
 *                 type: string
 *                 maxLength: 6
 *               nurse_ID:
 *                 type: string
 *                 maxLength: 6
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/", bookingController.create);

/**
 * @swagger
 * /booking:
 *   get:
 *     summary: Get all bookings
 *     tags: [Booking]
 *     responses:
 *       200:
 *         description: List of all bookings
 *       500:
 *         description: Server error
 */
router.get("/", bookingController.getAll);

/**
 * @swagger
 * /booking/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Booking]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking details
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */
router.get("/:id", bookingController.getById);

/**
 * @swagger
 * /booking/{id}:
 *   patch:
 *     summary: Update booking details
 *     tags: [Booking]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               booking_status:
 *                 type: string
 *                 enum: [pending, confirmed, completed, cancelled]
 *               total_cost:
 *                 type: number
 *               payment_status:
 *                 type: string
 *                 enum: [unpaid, paid, refunded]
 *               booked_datetime:
 *                 type: string
 *                 format: date-time
 *               invoice_ID:
 *                 type: string
 *               patient_ID:
 *                 type: string
 *                 maxLength: 6
 *               nurse_ID:
 *                 type: string
 *                 maxLength: 6
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */
router.patch("/:id", bookingController.update);

/**
 * @swagger
 * /booking/{id}:
 *   delete:
 *     summary: Delete booking
 *     tags: [Booking]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", bookingController.remove);

module.exports = router;
