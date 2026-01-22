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
 * /booking/request:
 *   post:
 *     summary: Create a booking request
 *     tags: [Booking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nurse_ID
 *               - patient_ID
 *               - booking_date
 *               - start_time
 *               - duration_hours
 *             properties:
 *               nurse_ID:
 *                 type: string
 *                 maxLength: 6
 *               patient_ID:
 *                 type: string
 *                 maxLength: 6
 *               service_category_ID:
 *                 type: string
 *                 maxLength: 6
 *               booking_date:
 *                 type: string
 *                 format: date
 *               start_time:
 *                 type: string
 *                 pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *               duration_hours:
 *                 type: number
 *                 minimum: 0.5
 *               address_ID:
 *                 type: integer
 *               special_instructions:
 *                 type: string
 *               emergency_contact:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking request created successfully
 *       400:
 *         description: Validation error or slot not available
 *       500:
 *         description: Server error
 */
router.post("/request", bookingController.createBookingRequest);

/**
 * @swagger
 * /booking/requests:
 *   get:
 *     summary: Get booking requests for a nurse
 *     tags: [Booking]
 *     parameters:
 *       - in: query
 *         name: nurseId
 *         schema:
 *           type: string
 *         description: Nurse ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending_nurse_approval, confirmed, in_progress, completed, cancelled_by_patient, cancelled_by_nurse, cancelled_by_admin]
 *         description: Filter by booking status
 *     responses:
 *       200:
 *         description: List of booking requests
 *       500:
 *         description: Server error
 */
router.get("/requests", bookingController.getBookingRequests);

/**
 * @swagger
 * /booking/patient/{patientId}:
 *   get:
 *     summary: Get bookings for a patient
 *     tags: [Booking]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         schema:
 *           type: string
 *         required: true
 *         description: Patient ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending_nurse_approval, confirmed, in_progress, completed, cancelled_by_patient, cancelled_by_nurse, cancelled_by_admin]
 *         description: Filter by booking status
 *     responses:
 *       200:
 *         description: List of patient bookings
 *       500:
 *         description: Server error
 */
router.get("/patient/:patientId", bookingController.getPatientBookings);

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
 * /booking/{id}/status:
 *   patch:
 *     summary: Update booking status
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending_nurse_approval, confirmed, in_progress, completed, cancelled_by_patient, cancelled_by_nurse, cancelled_by_admin]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 *       400:
 *         description: Validation error or invalid status transition
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */
router.patch("/:id/status", bookingController.updateBookingStatus);

/**
 * @swagger
 * /booking/{id}/emergency:
 *   post:
 *     summary: Report emergency for an active booking
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
 *               details:
 *                 type: string
 *                 description: Emergency details
 *               message:
 *                 type: string
 *                 description: Emergency message
 *     responses:
 *       200:
 *         description: Emergency reported successfully
 *       400:
 *         description: Validation error or booking not active
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */
router.post("/:id/emergency", bookingController.reportEmergency);

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
