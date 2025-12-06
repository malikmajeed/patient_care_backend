const express = require("express");
const router = express.Router();
const patientAuthController = require("../controllers/patient.auth.controller");
const { authenticate, isPatient } = require("../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Patient Auth
 *   description: Patient authentication endpoints
 */

/**
 * @swagger
 * /api/auth/patient/signup:
 *   post:
 *     summary: Register a new patient
 *     tags: [Patient Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - first_name
 *               - last_name
 *               - gender
 *               - phone_number
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               phone_number:
 *                 type: string
 *     responses:
 *       201:
 *         description: Patient created successfully
 */
router.post("/signup", patientAuthController.signup);

/**
 * @swagger
 * /api/auth/patient/login:
 *   post:
 *     summary: Patient login
 *     tags: [Patient Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username or email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: accessToken=abc123; HttpOnly; Secure; SameSite=Strict
 */
router.post("/login", patientAuthController.login);

/**
 * @swagger
 * /api/auth/patient/logout:
 *   post:
 *     summary: Patient logout
 *     tags: [Patient Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post("/logout", patientAuthController.logout);

/**
 * @swagger
 * /api/auth/patient/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Patient Auth]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 */
router.post("/refresh", patientAuthController.refreshToken);

/**
 * @swagger
 * /api/auth/patient/logout-all:
 *   post:
 *     summary: Logout from all devices
 *     tags: [Patient Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logged out from all devices
 */
router.post("/logout-all", authenticate, isPatient, patientAuthController.logoutAll);

/**
 * @swagger
 * /api/auth/patient/profile:
 *   get:
 *     summary: Get current patient profile
 *     tags: [Patient Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Patient profile retrieved
 */
router.get("/profile", authenticate, isPatient, patientAuthController.getProfile);

/**
 * @swagger
 * /api/auth/patient/sessions:
 *   get:
 *     summary: Get active sessions
 *     tags: [Patient Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Active sessions retrieved
 */
router.get("/sessions", authenticate, isPatient, patientAuthController.getSessions);

/**
 * @swagger
 * /api/auth/patient/verify:
 *   get:
 *     summary: Verify authentication status
 *     tags: [Patient Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Authentication verified
 */
router.get("/verify", authenticate, isPatient, patientAuthController.verifyAuth);

module.exports = router;
