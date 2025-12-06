const express = require("express");
const router = express.Router();
const adminAuthController = require("../controllers/admin.auth.controller");
const { authenticate, isAdmin } = require("../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Admin Auth
 *   description: Admin authentication endpoints
 */

/**
 * @swagger
 * /api/auth/admin/signup:
 *   post:
 *     summary: Register a new admin
 *     tags: [Admin Auth]
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
 *     responses:
 *       201:
 *         description: Admin created successfully
 */
router.post("/signup", adminAuthController.signup);

/**
 * @swagger
 * /api/auth/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin Auth]
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
router.post("/login", adminAuthController.login);

/**
 * @swagger
 * /api/auth/admin/logout:
 *   post:
 *     summary: Admin logout
 *     tags: [Admin Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post("/logout", adminAuthController.logout);

/**
 * @swagger
 * /api/auth/admin/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Admin Auth]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 */
router.post("/refresh", adminAuthController.refreshToken);

/**
 * @swagger
 * /api/auth/admin/logout-all:
 *   post:
 *     summary: Logout from all devices
 *     tags: [Admin Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logged out from all devices
 */
router.post("/logout-all", authenticate, isAdmin, adminAuthController.logoutAll);

/**
 * @swagger
 * /api/auth/admin/profile:
 *   get:
 *     summary: Get current admin profile
 *     tags: [Admin Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Admin profile retrieved
 */
router.get("/profile", authenticate, isAdmin, adminAuthController.getProfile);

/**
 * @swagger
 * /api/auth/admin/sessions:
 *   get:
 *     summary: Get active sessions
 *     tags: [Admin Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Active sessions retrieved
 */
router.get("/sessions", authenticate, isAdmin, adminAuthController.getSessions);

/**
 * @swagger
 * /api/auth/admin/verify:
 *   get:
 *     summary: Verify authentication status
 *     tags: [Admin Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Authentication verified
 */
router.get("/verify", authenticate, isAdmin, adminAuthController.verifyAuth);

module.exports = router;
