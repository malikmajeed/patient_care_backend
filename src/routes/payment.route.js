const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/payment.controller");

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: Payment management
 */

/**
 * @swagger
 * /payment:
 *   post:
 *     summary: Create a new payment
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - transaction_date
 *               - amount
 *               - payment_method
 *               - status
 *               - booking_ID
 *             properties:
 *               payment_ID:
 *                 type: string
 *                 maxLength: 6
 *               transaction_date:
 *                 type: string
 *                 format: date-time
 *               amount:
 *                 type: number
 *                 minimum: 0
 *               payment_method:
 *                 type: string
 *                 enum: [card, cash, bank_transfer, wallet]
 *               status:
 *                 type: string
 *                 enum: [pending, successful, failed]
 *               transaction_details:
 *                 type: string
 *               booking_ID:
 *                 type: string
 *                 maxLength: 6
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/", paymentController.create);

/**
 * @swagger
 * /payment:
 *   get:
 *     summary: Get all payments
 *     tags: [Payment]
 *     responses:
 *       200:
 *         description: List of all payments
 *       500:
 *         description: Server error
 */
router.get("/", paymentController.getAll);

/**
 * @swagger
 * /payment/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags: [Payment]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment details
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.get("/:id", paymentController.getById);

/**
 * @swagger
 * /payment/{id}:
 *   patch:
 *     summary: Update payment details
 *     tags: [Payment]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Payment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transaction_date:
 *                 type: string
 *                 format: date-time
 *               amount:
 *                 type: number
 *                 minimum: 0
 *               payment_method:
 *                 type: string
 *                 enum: [card, cash, bank_transfer, wallet]
 *               status:
 *                 type: string
 *                 enum: [pending, successful, failed]
 *               transaction_details:
 *                 type: string
 *               booking_ID:
 *                 type: string
 *                 maxLength: 6
 *     responses:
 *       200:
 *         description: Payment updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.patch("/:id", paymentController.update);

/**
 * @swagger
 * /payment/{id}:
 *   delete:
 *     summary: Delete payment
 *     tags: [Payment]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment deleted successfully
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", paymentController.remove);

/**
 * @swagger
 * /payments/initiate:
 *   post:
 *     summary: Initiate payment for a booking
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - booking_ID
 *               - payment_method
 *               - amount
 *             properties:
 *               booking_ID:
 *                 type: string
 *                 maxLength: 6
 *               payment_method:
 *                 type: string
 *                 enum: [jazzcash, easypaisa, cash, bank_transfer]
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Payment initiated successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/initiate", paymentController.initiatePayment);

router.post("/create-intent", paymentController.createPaymentIntent);

/**
 * @swagger
 * /payments/{id}/callback:
 *   post:
 *     summary: Handle payment gateway callback/webhook
 *     tags: [Payment]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Payment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [success, failed, pending]
 *               transaction_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment callback processed
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/:id/callback", paymentController.handlePaymentCallback);

/**
 * @swagger
 * /payments/{id}/invoice:
 *   get:
 *     summary: Get invoice for a payment
 *     tags: [Payment]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Invoice data
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
router.get("/:id/invoice", paymentController.getInvoice);

module.exports = router;


