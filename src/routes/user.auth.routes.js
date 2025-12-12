const express = require("express");
const router = express.Router();
const userAuthController = require("../controllers/user.auth.controller");
const { authenticate } = require("../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: User Auth
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * /api/auth/signup/patient:
 *   post:
 *     summary: Register a new patient
 *     tags: [User Auth]
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
router.post("/signup/patient", userAuthController.signupPatient);

/**
 * @swagger
 * /api/auth/signup/admin:
 *   post:
 *     summary: Register a new admin
 *     tags: [User Auth]
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
 *         description: Admin created successfully
 */
router.post("/signup/admin", userAuthController.signupAdmin);

/**
 * @swagger
 * /api/auth/signup/nurse:
 *   post:
 *     summary: Register a new nurse
 *     tags: [User Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - first_name
 *               - last_name
 *               - gender
 *               - phone_number
 *               - experience_level
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
 *               experience_level:
 *                 type: string
 *                 enum: [beginner, intermediate, expert]
 *     responses:
 *       201:
 *         description: Nurse created successfully
 */
router.post("/signup/nurse", userAuthController.signupNurse);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [User Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
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
router.post("/login", userAuthController.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [User Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post("/logout", userAuthController.logout);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [User Auth]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 */
router.post("/refresh", userAuthController.refreshToken);

/**
 * @swagger
 * /api/auth/logout-all:
 *   post:
 *     summary: Logout from all devices
 *     tags: [User Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logged out from all devices
 */
router.post("/logout-all", authenticate, userAuthController.logoutAll);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [User Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 */
router.get("/profile", authenticate, userAuthController.getProfile);

/**
 * @swagger
 * /api/auth/sessions:
 *   get:
 *     summary: Get active sessions
 *     tags: [User Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Active sessions retrieved
 */
router.get("/sessions", authenticate, userAuthController.getSessions);

/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     summary: Verify authentication status
 *     tags: [User Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Authentication verified
 */
router.get("/verify", authenticate, userAuthController.verifyAuth);

module.exports = router;
