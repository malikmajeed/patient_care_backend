#!/usr/bin/env node

/**
 * Script to check Backblaze B2 configuration
 * Run with: node check-b2-config.js
 */

require('dotenv').config();

const requiredVars = [
    'B2_APPLICATION_KEY_ID',
    'B2_APPLICATION_KEY',
    'B2_BUCKET_ID',
    'B2_PUBLIC_URL'
];

console.log('Checking Backblaze B2 Configuration...\n');

let allSet = true;

requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
        // Mask sensitive values
        if (varName === 'B2_APPLICATION_KEY') {
            console.log(`✓ ${varName}: ${value.substring(0, 10)}...${value.substring(value.length - 4)}`);
        } else {
            console.log(`✓ ${varName}: ${value}`);
        }
    } else {
        console.log(`✗ ${varName}: NOT SET`);
        allSet = false;
    }
});

console.log('');

if (allSet) {
    console.log('✓ All environment variables are set!');
    console.log('\nTesting B2 authorization...');
    
    const B2 = require('backblaze-b2');
    const b2 = new B2({
        applicationKeyId: process.env.B2_APPLICATION_KEY_ID,
        applicationKey: process.env.B2_APPLICATION_KEY,
    });

    b2.authorize()
        .then(() => {
            console.log('✓ Backblaze B2 authorization successful!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('✗ Backblaze B2 authorization failed:');
            console.error(`  Error: ${error.message}`);
            if (error.response) {
                console.error(`  Status: ${error.response.status} ${error.response.statusText}`);
            }
            process.exit(1);
        });
} else {
    console.log('✗ Some environment variables are missing.');
    console.log('\nPlease add them to your .env file:');
    console.log('B2_APPLICATION_KEY_ID=your_application_key_id');
    console.log('B2_APPLICATION_KEY=your_application_key');
    console.log('B2_BUCKET_ID=your_bucket_id');
    console.log('B2_PUBLIC_URL=https://f005.backblazeb2.com/file/your-bucket-name');
    process.exit(1);
}

