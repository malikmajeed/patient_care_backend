/**
 * Test script for UUID Generator
 * Run this to verify that all UUID generation functions work correctly
 */

const { connectDB } = require('./src/database');
const {
    generateBookingId,
    generatePaymentId,
    generateServiceCategoryId,
    generateWorkScheduleId,
    generateDocumentId,
    generateCareRequirementId,
    generateReviewId
} = require('./src/utils/uuid_generator');

const testUUIDGenerator = async () => {
    console.log('🧪 Testing UUID Generator...\n');

    try {
        // Connect to database first
        console.log('📡 Connecting to database...');
        await connectDB();
        console.log('✅ Database connected\n');

        // Test Booking ID
        console.log('📋 Testing Booking ID Generation:');
        const bookingId1 = await generateBookingId();
        const bookingId2 = await generateBookingId();
        console.log(`  Generated: ${bookingId1}`);
        console.log(`  Generated: ${bookingId2}`);
        console.log(`  ✅ Unique: ${bookingId1 !== bookingId2}\n`);

        // Test Payment ID
        console.log('💳 Testing Payment ID Generation:');
        const paymentId = await generatePaymentId();
        console.log(`  Generated: ${paymentId}`);
        console.log(`  ✅ Format: ${paymentId.startsWith('PY') && paymentId.length === 6}\n`);

        // Test Service Category ID
        console.log('🏥 Testing Service Category ID Generation:');
        const categoryId = await generateServiceCategoryId();
        console.log(`  Generated: ${categoryId}`);
        console.log(`  ✅ Format: ${categoryId.startsWith('SC') && categoryId.length === 6}\n`);

        // Test Work Schedule ID
        console.log('📅 Testing Work Schedule ID Generation:');
        const workId = await generateWorkScheduleId();
        console.log(`  Generated: ${workId}`);
        console.log(`  ✅ Format: ${workId.startsWith('WS') && workId.length === 6}\n`);

        // Test Document ID
        console.log('📄 Testing Document ID Generation:');
        const docId = await generateDocumentId();
        console.log(`  Generated: ${docId}`);
        console.log(`  ✅ Format: ${docId.startsWith('DC') && docId.length === 6}\n`);

        // Test Care Requirement ID
        console.log('🩺 Testing Care Requirement ID Generation:');
        const reqId = await generateCareRequirementId();
        console.log(`  Generated: ${reqId}`);
        console.log(`  ✅ Format: ${reqId.startsWith('CR') && reqId.length === 6}\n`);

        // Test Review ID
        console.log('⭐ Testing Review ID Generation:');
        const reviewId = await generateReviewId();
        console.log(`  Generated: ${reviewId}`);
        console.log(`  ✅ Format: ${reviewId.startsWith('RV') && reviewId.length === 6}\n`);

        // Test uniqueness with multiple generations
        console.log('🔄 Testing Uniqueness (generating 100 IDs):');
        const ids = new Set();
        for (let i = 0; i < 100; i++) {
            const id = await generateBookingId();
            ids.add(id);
        }
        console.log(`  Generated: ${ids.size} unique IDs`);
        console.log(`  ✅ All unique: ${ids.size === 100}\n`);

        console.log('✅ All tests passed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
};

// Run tests
testUUIDGenerator();
