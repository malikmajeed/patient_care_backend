const express = require("express");
const router = express.Router();

const addressController = require("../controllers/address.controller");

/**
 * @swagger
 * tags:
 *   name: Address
 *   description: Patient address management
 */

/**
 * @swagger
 * /patients/{patientId}/addresses:
 *   post:
 *     summary: Create a new address for a patient
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         schema:
 *           type: string
 *         required: true
 *         description: Patient ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - street_address
 *               - area
 *             properties:
 *               label:
 *                 type: string
 *                 maxLength: 50
 *               house_number:
 *                 type: string
 *                 maxLength: 50
 *               street_address:
 *                 type: string
 *                 maxLength: 200
 *               area:
 *                 type: string
 *                 maxLength: 100
 *               landmark:
 *                 type: string
 *                 maxLength: 200
 *               postal_code:
 *                 type: string
 *                 maxLength: 10
 *               contact_person:
 *                 type: string
 *                 maxLength: 100
 *               contact_phone:
 *                 type: string
 *                 maxLength: 20
 *               is_default:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: Address created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/:patientId/addresses", addressController.create);

/**
 * @swagger
 * /patients/{patientId}/addresses:
 *   get:
 *     summary: Get all addresses for a patient
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         schema:
 *           type: string
 *         required: true
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: List of addresses
 *       500:
 *         description: Server error
 */
router.get("/:patientId/addresses", addressController.getByPatientId);

/**
 * @swagger
 * /addresses/{id}:
 *   get:
 *     summary: Get address by ID
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address details
 *       404:
 *         description: Address not found
 *       500:
 *         description: Server error
 */
router.get("/:id", addressController.getById);

/**
 * @swagger
 * /addresses/{id}:
 *   patch:
 *     summary: Update address
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *               street_address:
 *                 type: string
 *               area:
 *                 type: string
 *               landmark:
 *                 type: string
 *               is_default:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Address not found
 *       500:
 *         description: Server error
 */
router.patch("/:id", addressController.update);

/**
 * @swagger
 * /addresses/{id}/set-default:
 *   patch:
 *     summary: Set address as default
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Default address set successfully
 *       404:
 *         description: Address not found
 *       500:
 *         description: Server error
 */
router.patch("/:id/set-default", addressController.setDefault);

/**
 * @swagger
 * /addresses/{id}:
 *   delete:
 *     summary: Delete address
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       404:
 *         description: Address not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", addressController.remove);

module.exports = router;
