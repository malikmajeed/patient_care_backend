const express = require("express");
const router = express.Router();
const { authenticate,
    isAdmin,
    isPatient,
    hasAdminRole,
    isResourceOwner,
    optionalAuth } = require("../middlewares/auth.middleware");

const nurseController = require("../controllers/nurse.controller");

/**
 * @swagger
 * tags:
 *   name: Nurse
 *   description: Nurse management
 */

/**
 * @swagger
 * /nurse/signup:
 *   post:
 *     summary: Create a new nurse account
 *     tags: [Nurse]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - gender
 *               - email
 *               - password
 *               - phone_number
 *               - experience_level
 *             properties:
 *               nurse_ID:
 *                 type: string
 *                 maxLength: 6
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
 *                 default: pending
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
 *                 default: true
 *     responses:
 *       201:
 *         description: Nurse created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/signup", nurseController.signup);

/**
 * @swagger
 * /nurse/login:
 *   post:
 *     summary: Login nurse
 *     tags: [Nurse]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nurse logged in successfully
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login", authenticate, nurseController.login);

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
router.patch("/update/:id", authenticate, isResourceOwner || hasAdminRole, nurseController.update);

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
router.get("/:id", authenticate, isResourceOwner || hasAdminRole, nurseController.getById);

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

module.exports = router;
