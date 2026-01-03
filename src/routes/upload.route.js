const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/upload.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");
const path = require("path");

// Configure multer to use memory storage (no local disk storage)
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        // Allow PDF, images
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF, JPEG, JPG, and PNG files are allowed'));
        }
    }
});

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File upload management
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a file to Backblaze B2
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: No file uploaded or invalid file type
 *       500:
 *         description: Server error
 */
router.post("/", authMiddleware.authenticate, upload.single('file'), uploadController.uploadFile);

module.exports = router;

