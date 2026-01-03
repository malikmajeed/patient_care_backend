# Backblaze B2 Setup

This document explains how to set up Backblaze B2 for file uploads.

## Prerequisites

1. Create a Backblaze B2 account at https://www.backblaze.com/b2/sign-up.html
2. Create a bucket in your B2 account
3. Get your Application Key ID and Application Key from B2

## Environment Variables

Add the following variables to your `.env` file:

```env
# Backblaze B2 Configuration
B2_APPLICATION_KEY_ID=your_application_key_id
B2_APPLICATION_KEY=your_application_key
B2_BUCKET_ID=your_bucket_id
B2_PUBLIC_URL=https://f005.backblazeb2.com/file/your-bucket-name
```

**Note:** The B2_PUBLIC_URL format depends on your region:
- For us-east-005: `https://f005.backblazeb2.com/file/your-bucket-name`
- For other regions, replace `f005` with your region's endpoint ID
- Or use S3-compatible format: `https://s3.us-east-005.backblazeb2.com/your-bucket-name`

Replace `your-bucket-name` with your actual bucket name from Backblaze.

## Steps to Get B2 Credentials

1. Log in to your Backblaze account
2. Go to "App Keys" section
3. Create a new Application Key with read and write permissions
4. Copy the `keyID` and `applicationKey`
5. Go to "Buckets" section
6. Create a new bucket (or use existing)
7. Copy the `bucketId` from bucket settings
8. Get the public URL from bucket settings (format: `https://f000.backblazeb2.com/file/bucket-name`)

## Bucket Configuration

- Make sure your bucket is set to "Public" if you want public access to files
- Or use "Private" and generate signed URLs for file access

## Testing

Once configured, you can test the upload endpoint:

```bash
POST /api/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>

file: <file>
```

The endpoint will return:
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "url": "https://f000.backblazeb2.com/file/bucket-name/documents/...",
    "fileName": "documents/1234567890-abc123.pdf",
    "fileId": "4_zBcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz"
  }
}
```

