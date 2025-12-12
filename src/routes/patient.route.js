const express = require("express");
const router = express.Router();

const patientController = require("../controllers/patient.controller");

/**
 * @swagger
 * tags:
 *   name: Patient
 *   description: Patient management
 */



/**
 * @swagger
 * /patient/update/{id}:
 *   patch:
 *     summary: Update patient details
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: id
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
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
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
 *               profile_url:
 *                 type: string
 *                 format: uri
 *               address:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Server error
 */
router.patch("/update/:id", patientController.update);

/**
 * @swagger
 * /patient:
 *   get:
 *     summary: Get all patients
 *     tags: [Patient]
 *     responses:
 *       200:
 *         description: List of all patients
 *       500:
 *         description: Server error
 */
router.get("/", patientController.getAllPatients);

/**
 * @swagger
 * /patient/{id}:
 *   get:
 *     summary: Get patient by ID
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: Patient details
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Server error
 */
router.get("/:id", patientController.getPatientById);

/**
 * @swagger
 * /patient/{id}:
 *   delete:
 *     summary: Delete patient
 *     tags: [Patient]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", patientController.deletePatient);

module.exports = router;