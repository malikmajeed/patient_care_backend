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
 * /admin/signup:
 *   post:
 *     summary: Create a new admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *               - role
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
 *       201:
 *         description: Admin created successfully
 *       500:
 *         description: Server error
 */
router.post("/signup", adminController.signup);

/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Login admin
 *     tags: [Admin]
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin logged in successfully
 *       500:
 *         description: Server error
 */
router.post("/login", adminController.login);

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

module.exports = router;