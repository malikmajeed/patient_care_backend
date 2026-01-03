const backblazeService = require('../services/backblaze.service');
const documentService = require('../services/document.service');
const multer = require('multer');
const path = require('path');

// Configure multer to use memory storage (no local disk storage)
// Files will be uploaded directly to Backblaze B2 from memory
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

// Upload single file
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }

        // Upload file to Backblaze B2
        const result = await backblazeService.uploadFile(req.file, 'documents');

        // If user is a nurse and document metadata is provided, create document record
        let document = null;
        if (req.user && req.user.user_type === 'nurse' && req.body.issuing_authority && req.body.issue_date && req.body.type) {
            try {
                // req.user.user_id is actually the nurse_ID for nurses (see auth.service.js:49)
                document = await documentService.create({
                    nurse_ID: req.user.user_id,
                    url: result.url,
                    issuing_authority: req.body.issuing_authority,
                    issue_date: req.body.issue_date,
                    type: req.body.type
                });
            } catch (docError) {
                // Log error but don't fail the upload
                console.error('Failed to create document record:', docError.message);
            }
        }

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                url: result.url,
                fileName: result.fileName,
                fileId: result.fileId,
                document: document ? {
                    doc_ID: document.doc_ID,
                    nurse_ID: document.nurse_ID,
                    attachment_url: document.attachment_url
                } : null
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to upload file'
        });
    }
};

module.exports = {
    uploadFile,
    upload, // Export multer middleware
};

