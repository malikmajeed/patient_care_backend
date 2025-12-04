const express = require("express");
const router = express.Router();

const documentController = require("../controllers/document.controller");

/**
 * @swagger
 * tags:
 *   name: Document
 *   description: Document management
 */

/**
 * @swagger
 * /document:
 *   post:
 *     summary: Create a new document
 *     tags: [Document]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nurse_ID
 *               - url
 *               - type
 *             properties:
 *               Doc_ID:
 *                 type: string
 *                 maxLength: 6
 *               nurse_ID:
 *                 type: string
 *                 maxLength: 6
 *               url:
 *                 type: string
 *                 format: uri
 *               type:
 *                 type: string
 *                 enum: [certification, diploma, other]
 *     responses:
 *       201:
 *         description: Document created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/", documentController.create);

/**
 * @swagger
 * /document:
 *   get:
 *     summary: Get all documents
 *     tags: [Document]
 *     responses:
 *       200:
 *         description: List of all documents
 *       500:
 *         description: Server error
 */
router.get("/", documentController.getAll);

/**
 * @swagger
 * /document/{id}:
 *   get:
 *     summary: Get document by ID
 *     tags: [Document]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Document ID
 *     responses:
 *       200:
 *         description: Document details
 *       404:
 *         description: Document not found
 *       500:
 *         description: Server error
 */
router.get("/:id", documentController.getById);

/**
 * @swagger
 * /document/{id}:
 *   patch:
 *     summary: Update document details
 *     tags: [Document]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Document ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nurse_ID:
 *                 type: string
 *                 maxLength: 6
 *               url:
 *                 type: string
 *                 format: uri
 *               type:
 *                 type: string
 *                 enum: [certification, diploma, other]
 *     responses:
 *       200:
 *         description: Document updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Document not found
 *       500:
 *         description: Server error
 */
router.patch("/:id", documentController.update);

/**
 * @swagger
 * /document/{id}:
 *   delete:
 *     summary: Delete document
 *     tags: [Document]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Document ID
 *     responses:
 *       200:
 *         description: Document deleted successfully
 *       404:
 *         description: Document not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", documentController.remove);

module.exports = router;


