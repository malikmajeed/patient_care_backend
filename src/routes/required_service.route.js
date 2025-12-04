const express = require("express");
const router = express.Router();

const requiredServiceController = require("../controllers/required_service.controller");

/**
 * @swagger
 * tags:
 *   name: Required Service
 *   description: Required service management
 */

/**
 * @swagger
 * /required-service:
 *   post:
 *     summary: Create a new required service
 *     tags: [Required Service]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - req_ID
 *               - category_ID
 *             properties:
 *               req_ID:
 *                 type: string
 *                 maxLength: 6
 *               category_ID:
 *                 type: string
 *                 maxLength: 6
 *     responses:
 *       201:
 *         description: Required service created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/", requiredServiceController.create);

/**
 * @swagger
 * /required-service:
 *   get:
 *     summary: Get all required services
 *     tags: [Required Service]
 *     responses:
 *       200:
 *         description: List of all required services
 *       500:
 *         description: Server error
 */
router.get("/", requiredServiceController.getAll);

/**
 * @swagger
 * /required-service/{reqId}/{categoryId}:
 *   get:
 *     summary: Get required service by composite ID
 *     tags: [Required Service]
 *     parameters:
 *       - in: path
 *         name: reqId
 *         schema:
 *           type: string
 *         required: true
 *         description: Requirement ID
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Required service details
 *       404:
 *         description: Required service not found
 *       500:
 *         description: Server error
 */
router.get("/:reqId/:categoryId", requiredServiceController.getById);

/**
 * @swagger
 * /required-service/{reqId}/{categoryId}:
 *   patch:
 *     summary: Update required service details
 *     tags: [Required Service]
 *     parameters:
 *       - in: path
 *         name: reqId
 *         schema:
 *           type: string
 *         required: true
 *         description: Requirement ID
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               req_ID:
 *                 type: string
 *                 maxLength: 6
 *               category_ID:
 *                 type: string
 *                 maxLength: 6
 *     responses:
 *       200:
 *         description: Required service updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Required service not found
 *       500:
 *         description: Server error
 */
router.patch("/:reqId/:categoryId", requiredServiceController.update);

/**
 * @swagger
 * /required-service/{reqId}/{categoryId}:
 *   delete:
 *     summary: Delete required service
 *     tags: [Required Service]
 *     parameters:
 *       - in: path
 *         name: reqId
 *         schema:
 *           type: string
 *         required: true
 *         description: Requirement ID
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Required service deleted successfully
 *       404:
 *         description: Required service not found
 *       500:
 *         description: Server error
 */
router.delete("/:reqId/:categoryId", requiredServiceController.remove);

module.exports = router;


