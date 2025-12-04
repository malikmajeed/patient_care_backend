const express = require("express");
const router = express.Router();

const serviceCategoryController = require("../controllers/service_category.controller");

/**
 * @swagger
 * tags:
 *   name: Service Category
 *   description: Service category management
 */

/**
 * @swagger
 * /service-category:
 *   post:
 *     summary: Create a new service category
 *     tags: [Service Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category_name
 *             properties:
 *               category_ID:
 *                 type: string
 *                 maxLength: 6
 *               category_name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Service category created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/", serviceCategoryController.create);

/**
 * @swagger
 * /service-category:
 *   get:
 *     summary: Get all service categories
 *     tags: [Service Category]
 *     responses:
 *       200:
 *         description: List of all service categories
 *       500:
 *         description: Server error
 */
router.get("/", serviceCategoryController.getAll);

/**
 * @swagger
 * /service-category/{id}:
 *   get:
 *     summary: Get service category by ID
 *     tags: [Service Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Service Category ID
 *     responses:
 *       200:
 *         description: Service category details
 *       404:
 *         description: Service category not found
 *       500:
 *         description: Server error
 */
router.get("/:id", serviceCategoryController.getById);

/**
 * @swagger
 * /service-category/{id}:
 *   patch:
 *     summary: Update service category details
 *     tags: [Service Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Service Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Service category updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Service category not found
 *       500:
 *         description: Server error
 */
router.patch("/:id", serviceCategoryController.update);

/**
 * @swagger
 * /service-category/{id}:
 *   delete:
 *     summary: Delete service category
 *     tags: [Service Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Service Category ID
 *     responses:
 *       200:
 *         description: Service category deleted successfully
 *       404:
 *         description: Service category not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", serviceCategoryController.remove);

module.exports = router;


