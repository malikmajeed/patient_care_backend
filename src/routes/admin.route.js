const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin.controller");

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management
 */



/**
 * @swagger
 * /admin/update/{id}:
 *   patch:
 *     summary: Update admin details
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Admin ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [superadmin, manager, staff]
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *       500:
 *         description: Server error
 */
router.patch("/update/:id", adminController.update);

/**
 * @swagger
 * /admin/all:
 *   get:
 *     summary: Get all admins
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all admins
 *       500:
 *         description: Server error
 */
router.get("/all", adminController.getAllAdmins);

/**
 * @swagger
 * /admin/{id}:
 *   get:
 *     summary: Get admin by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Admin ID
 *     responses:
 *       200:
 *         description: Admin details
 *       500:
 *         description: Server error
 */
router.get("/:id", adminController.getAdminById);

/**
 * @swagger
 * /admin/{id}:
 *   delete:
 *     summary: Delete admin
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Admin ID
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *       500:
 *         description: Server error
 */
router.delete("/:id", adminController.deleteAdmin);

/**
 * @swagger
 * /admins/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *       500:
 *         description: Server error
 */
router.get("/dashboard/stats", adminController.getDashboardStats);

/**
 * @swagger
 * /admins/analytics:
 *   get:
 *     summary: Get analytics data
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [7days, 30days, 90days]
 *           default: 30days
 *         description: Time period for analytics
 *     responses:
 *       200:
 *         description: Analytics data
 *       500:
 *         description: Server error
 */
router.get("/analytics", adminController.getAnalytics);

module.exports = router;