/**
 * Comprehensive API Test Suite
 * Tests all major API endpoints for the Patient Care Management System
 */

const axios = require('axios');
const { connectDB } = require('../src/database');
const {
    User,
    Admin,
    Patient,
    Nurse,
    Booking,
    Payment,
    Review,
    Document,
    PatientAddress,
    Notification
} = require('../src/models');

const BASE_URL = process.env.API_URL || 'http://localhost:5000/api';

// Create axios instances with cookie support for each user type
const adminClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
});

const patientClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
});

const nurseClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
});

// Test configuration
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

let testPatientId = null;
let testNurseId = null;
let testBookingId = null;
let testAddressId = null;

// Helper functions
const log = (message, color = 'reset') => {
    console.log(`${colors[color]}${message}${colors.reset}`);
};

const logTest = (testName) => {
    log(`\n${'='.repeat(60)}`, 'cyan');
    log(`Testing: ${testName}`, 'cyan');
    log('='.repeat(60), 'cyan');
};

const logSuccess = (message) => log(`✓ ${message}`, 'green');
const logError = (message) => log(`✗ ${message}`, 'red');
const logInfo = (message) => log(`ℹ ${message}`, 'blue');

// Test runner
class TestRunner {
    constructor() {
        this.passed = 0;
        this.failed = 0;
        this.tests = [];
    }

    async run(testName, testFn) {
        try {
            await testFn();
            this.passed++;
            logSuccess(testName);
            return true;
        } catch (error) {
            this.failed++;
            logError(`${testName}: ${error.message}`);
            if (error.response) {
                logError(`  Status: ${error.response.status}`);
                logError(`  Data: ${JSON.stringify(error.response.data, null, 2)}`);
            }
            return false;
        }
    }

    summary() {
        log('\n' + '='.repeat(60), 'cyan');
        log('TEST SUMMARY', 'cyan');
        log('='.repeat(60), 'cyan');
        log(`Total Tests: ${this.passed + this.failed}`, 'blue');
        log(`Passed: ${this.passed}`, 'green');
        log(`Failed: ${this.failed}`, 'red');
        log('='.repeat(60), 'cyan');
    }
}

const runner = new TestRunner();

// ========== AUTHENTICATION TESTS ==========
async function testAuthentication() {
    logTest('Authentication');

    // Admin Login
    await runner.run('Admin Login', async () => {
        const response = await adminClient.post('/auth/login', {
            username: 'admin@gmail.com', // Can use email or username
            password: 'Admin@123'
        });
        if (!response.data.success) {
            throw new Error(`Login failed: ${response.data.message || 'Unknown error'}`);
        }
    });

    // Patient Login
    await runner.run('Patient Login', async () => {
        const response = await patientClient.post('/auth/login', {
            username: 'patient1@example.com',
            password: 'Patient@123'
        });
        if (!response.data.success) {
            throw new Error(`Login failed: ${response.data.message || 'Unknown error'}`);
        }
    });

    // Nurse Login
    await runner.run('Nurse Login', async () => {
        const response = await nurseClient.post('/auth/login', {
            username: 'nurse1@example.com',
            password: 'Nurse@123'
        });
        if (!response.data.success) {
            throw new Error(`Login failed: ${response.data.message || 'Unknown error'}`);
        }
    });
}

// ========== NURSE TESTS ==========
async function testNurseEndpoints() {
    logTest('Nurse Endpoints');

    // Get All Nurses
    await runner.run('Get All Nurses', async () => {
        const response = await adminClient.get('/nurses');
        if (!Array.isArray(response.data.nurses || response.data)) {
            throw new Error('Invalid response format');
        }
        if (response.data.nurses) {
            testNurseId = response.data.nurses[0]?.nurse_ID;
        } else if (response.data[0]) {
            testNurseId = response.data[0].nurse_ID;
        }
    });

    // Search Nurses
    await runner.run('Search Nurses', async () => {
        const response = await patientClient.get('/nurses/search', {
            params: {
                verification_status: 'verified',
                min_rating: 4.0,
                page: 1,
                limit: 10
            }
        });
        if (!response.data.nurses && !Array.isArray(response.data)) {
            throw new Error('Invalid search response');
        }
    });

    // Get Nurse Availability
    if (testNurseId) {
        await runner.run('Get Nurse Availability', async () => {
            const response = await patientClient.get(
                `/nurses/${testNurseId}/availability`,
                {
                    params: { date: '2024-12-25' }
                }
            );
            if (!response.data.available_slots) {
                throw new Error('No availability data returned');
            }
        });
    }
}

// ========== BOOKING TESTS ==========
async function testBookingEndpoints() {
    logTest('Booking Endpoints');

    // Create Booking Request
    await runner.run('Create Booking Request', async () => {
        if (!testNurseId || !testAddressId) {
            throw new Error('Missing test data (nurse ID or address ID)');
        }
        const response = await patientClient.post('/bookings/request', {
            nurse_ID: testNurseId,
            service_category_ID: 'CAT001',
            booked_datetime: '2024-12-28T10:00:00',
            start_time: '10:00:00',
            end_time: '16:00:00',
            duration_hours: 6,
            address_ID: testAddressId,
            special_instructions: 'Test booking for API testing',
            total_cost: 360.00
        });
        if (!response.data.booking) {
            throw new Error('Booking not created');
        }
        testBookingId = response.data.booking.booking_ID;
    });

    // Get Patient Bookings
    await runner.run('Get Patient Bookings', async () => {
        if (!testPatientId) {
            throw new Error('Missing test patient ID');
        }
        const response = await patientClient.get(
            `/bookings/patient/${testPatientId}`,
            {
                params: { status: 'pending_nurse_approval' }
            }
        );
        if (!response.data.bookings && !Array.isArray(response.data)) {
            throw new Error('Invalid bookings response');
        }
    });

    // Update Booking Status
    if (testBookingId) {
        await runner.run('Update Booking Status', async () => {
            const response = await nurseClient.patch(
                `/bookings/${testBookingId}/status`,
                { status: 'confirmed' }
            );
            if (!response.data.booking) {
                throw new Error('Booking status not updated');
            }
        });
    }
}

// ========== ADDRESS TESTS ==========
async function testAddressEndpoints() {
    logTest('Address Endpoints');

    // Get Patient Addresses
    await runner.run('Get Patient Addresses', async () => {
        if (!testPatientId) {
            throw new Error('Missing test patient ID');
        }
        const response = await patientClient.get(
            `/patients/${testPatientId}/addresses`
        );
        if (!Array.isArray(response.data.addresses || response.data)) {
            throw new Error('Invalid addresses response');
        }
        if (response.data.addresses && response.data.addresses.length > 0) {
            testAddressId = response.data.addresses[0].address_ID;
        } else if (response.data.length > 0) {
            testAddressId = response.data[0].address_ID;
        }
    });

    // Create Address
    await runner.run('Create Patient Address', async () => {
        if (!testPatientId) {
            throw new Error('Missing test patient ID');
        }
        const response = await patientClient.post(
            `/patients/${testPatientId}/addresses`,
            {
                label: 'Test Address',
                house_number: '999',
                street_address: 'Test Street',
                area: 'Test Area',
                postal_code: '99999',
                is_default: false
            }
        );
        if (!response.data.address) {
            throw new Error('Address not created');
        }
        if (!testAddressId) {
            testAddressId = response.data.address.address_ID;
        }
    });
}

// ========== NOTIFICATION TESTS ==========
async function testNotificationEndpoints() {
    logTest('Notification Endpoints');

    // Get Notifications
    await runner.run('Get Notifications', async () => {
        const response = await patientClient.get('/notifications', {
            params: { unread_only: true }
        });
        if (!Array.isArray(response.data.notifications || response.data)) {
            throw new Error('Invalid notifications response');
        }
    });

    // Mark Notification as Read
    await runner.run('Mark Notification as Read', async () => {
        const notificationsResponse = await patientClient.get('/notifications');
        const notifications = notificationsResponse.data.notifications || notificationsResponse.data;
        if (notifications.length > 0) {
            const notificationId = notifications[0].notification_ID;
            const response = await patientClient.patch(
                `/notifications/${notificationId}/read`,
                {}
            );
            if (response.status !== 200) {
                throw new Error('Failed to mark notification as read');
            }
        }
    });
}

// ========== REVIEW TESTS ==========
async function testReviewEndpoints() {
    logTest('Review Endpoints');

    // Create Review
    await runner.run('Create Review', async () => {
        if (!testBookingId || !testNurseId) {
            throw new Error('Missing test data for review');
        }
        const response = await patientClient.post('/reviews', {
            booking_ID: testBookingId,
            nurse_ID: testNurseId,
            rating_score: 5,
            written_review: 'Excellent service! Very professional and caring.'
        });
        if (!response.data.review) {
            throw new Error('Review not created');
        }
    });
}

// ========== WORK SCHEDULE TESTS ==========
async function testWorkScheduleEndpoints() {
    logTest('Work Schedule Endpoints');

    // Get Nurse Schedule
    if (testNurseId) {
        await runner.run('Get Nurse Schedule', async () => {
            const response = await nurseClient.get(
                `/work-schedules/nurse/${testNurseId}`
            );
            if (!response.data.schedule && !Array.isArray(response.data)) {
                throw new Error('Invalid schedule response');
            }
        });
    }
}

// ========== ADMIN TESTS ==========
async function testAdminEndpoints() {
    logTest('Admin Endpoints');

    // Get Dashboard Stats
    await runner.run('Get Dashboard Stats', async () => {
        const response = await adminClient.get('/admins/dashboard-stats');
        if (!response.data.stats) {
            throw new Error('Invalid dashboard stats response');
        }
    });

    // Get Analytics
    await runner.run('Get Analytics', async () => {
        const response = await adminClient.get('/admins/analytics');
        if (!response.data.analytics) {
            throw new Error('Invalid analytics response');
        }
    });
}

// ========== MAIN TEST RUNNER ==========
async function runAllTests() {
    log('\n' + '='.repeat(60), 'yellow');
    log('PATIENT CARE MANAGEMENT SYSTEM - API TEST SUITE', 'yellow');
    log('='.repeat(60), 'yellow');
    log(`Base URL: ${BASE_URL}`, 'blue');
    log(`Start Time: ${new Date().toISOString()}`, 'blue');

    try {
        // Connect to database
        logInfo('Connecting to database...');
        await connectDB();

        // Get test patient ID
        const patientUser = await User.findOne({ where: { email: 'patient1@example.com' } });
        if (patientUser) {
            const patient = await Patient.findOne({ where: { user_ID: patientUser.user_ID } });
            if (patient) {
                testPatientId = patient.patient_ID;
            }
        }

        // Run tests
        await testAuthentication();
        await testNurseEndpoints();
        await testAddressEndpoints();
        await testBookingEndpoints();
        await testNotificationEndpoints();
        await testReviewEndpoints();
        await testWorkScheduleEndpoints();
        await testAdminEndpoints();

    } catch (error) {
        logError(`Test suite error: ${error.message}`);
        console.error(error);
    } finally {
        runner.summary();
        log(`\nEnd Time: ${new Date().toISOString()}`, 'blue');
        process.exit(runner.failed > 0 ? 1 : 0);
    }
}

// Run tests if called directly
if (require.main === module) {
    runAllTests();
}

module.exports = { runAllTests };
