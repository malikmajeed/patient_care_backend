const B2 = require('backblaze-b2');
const fs = require('fs');
const path = require('path');

// Initialize B2 client
const b2 = new B2({
    applicationKeyId: process.env.B2_APPLICATION_KEY_ID,
    applicationKey: process.env.B2_APPLICATION_KEY,
});

let authorized = false;
let authorizationPromise = null;

// Authorize B2 account
const authorize = async () => {
    // Check if environment variables are set
    if (!process.env.B2_APPLICATION_KEY_ID || !process.env.B2_APPLICATION_KEY) {
        throw new Error('Backblaze B2 credentials not configured. Please set B2_APPLICATION_KEY_ID and B2_APPLICATION_KEY environment variables.');
    }

    // If already authorized, return immediately
    if (authorized) {
        return;
    }

    // If authorization is in progress, wait for it
    if (authorizationPromise) {
        return authorizationPromise;
    }

    // Start new authorization
    authorizationPromise = (async () => {
        try {
            await b2.authorize();
            authorized = true;
            authorizationPromise = null; // Clear promise after success
            console.log('Backblaze B2 authorized successfully');
        } catch (error) {
            authorized = false;
            authorizationPromise = null; // Clear promise on error to allow retry
            console.error('B2 authorization error:', error);
            
            // Provide more detailed error message
            if (error.response) {
                throw new Error(`Failed to authorize with Backblaze B2: ${error.response.status} - ${error.response.statusText}. Please check your B2_APPLICATION_KEY_ID and B2_APPLICATION_KEY.`);
            } else if (error.message) {
                throw new Error(`Failed to authorize with Backblaze B2: ${error.message}`);
            } else {
                throw new Error('Failed to authorize with Backblaze B2. Please check your credentials and network connection.');
            }
        }
    })();

    return authorizationPromise;
};

// Upload file to B2
const uploadFile = async (file, folder = 'documents') => {
    try {
        // Check if bucket ID is configured
        if (!process.env.B2_BUCKET_ID) {
            throw new Error('B2_BUCKET_ID environment variable is not set');
        }

        if (!process.env.B2_PUBLIC_URL) {
            throw new Error('B2_PUBLIC_URL environment variable is not set');
        }

        await authorize();

        // Get upload URL
        const bucketId = process.env.B2_BUCKET_ID;
        const response = await b2.getUploadUrl({
            bucketId: bucketId,
        });

        const uploadUrl = response.data.uploadUrl;
        const uploadAuthToken = response.data.authorizationToken;

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExtension = path.extname(file.originalname);
        const fileName = `${folder}/${timestamp}-${randomString}${fileExtension}`;

        // Read file buffer
        let fileBuffer;
        if (file.buffer) {
            // If file is in memory (from memoryStorage)
            fileBuffer = file.buffer;
        } else if (file.path) {
            // If file is on disk (from diskStorage)
            fileBuffer = fs.readFileSync(file.path);
        } else {
            throw new Error('File data not found');
        }

        // Upload file
        const uploadResponse = await b2.uploadFile({
            uploadUrl: uploadUrl,
            uploadAuthToken: uploadAuthToken,
            fileName: fileName,
            data: fileBuffer,
            contentLength: file.size,
            contentType: file.mimetype,
        });

        // Clean up temporary file if it exists on disk
        if (file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        // Construct public URL
        const publicUrl = `${process.env.B2_PUBLIC_URL}/${fileName}`;

        return {
            fileId: uploadResponse.data.fileId,
            fileName: fileName,
            url: publicUrl,
        };
    } catch (error) {
        // Clean up temporary file if it exists on disk
        if (file && file.path && fs.existsSync(file.path)) {
            try {
                fs.unlinkSync(file.path);
            } catch (unlinkError) {
                console.error('Error cleaning up temp file:', unlinkError);
            }
        }
        console.error('B2 upload error:', error);
        throw new Error(`Failed to upload file to Backblaze: ${error.message}`);
    }
};

// Delete file from B2
const deleteFile = async (fileId) => {
    try {
        await authorize();

        await b2.deleteFileVersion({
            fileId: fileId,
            fileName: '', // B2 will find it by fileId
        });

        return true;
    } catch (error) {
        console.error('B2 delete error:', error);
        throw new Error(`Failed to delete file from Backblaze: ${error.message}`);
    }
};

module.exports = {
    uploadFile,
    deleteFile,
};

