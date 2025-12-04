const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

// Test data with unique identifiers
const timestamp = Date.now();
const testData = {
    admin: {
        username: `testadmin${timestamp}`,
        first_name: 'Test',
        last_name: 'Admin',
        email: `testadmin${timestamp}@example.com`,
        password: 'password123',
        role: 'admin'
    },
    patient: {
        first_name: 'John',
        last_name: 'Doe',
        username: `johndoe${timestamp}`,
        gender: 'male',
        email: `johndoe${timestamp}@example.com`,
        password: 'password123',
        phone_number: `+123456${timestamp}`,
        address: '123 Main St',
        latitude: 40.7128,
        longitude: -74.0060
    },
    nurse: {
        first_name: 'Jane',
        last_name: 'Smith',
        gender: 'female',
        email: `janesmith${timestamp}@example.com`,
        password: 'password123',
        phone_number: `+123456${timestamp + 1}`,
        address: '456 Oak Ave',
        experience_level: 'intermediate',
        latitude: 40.7580,
        longitude: -73.9855
    },
    serviceCategory: {
        category_name: `Wound Care ${timestamp}`
    },
    careRequirement: {
        symptoms_problems: 'Post-surgery wound care needed',
        hours_per_day: 4,
        date_time_of_service: new Date().toISOString()
    },
    workSchedule: {
        day: 'monday',
        time_range: '09:00-17:00'
    },
    document: {
        url: 'https://example.com/certificate.pdf',
        type: 'certification'
    },
    booking: {
        booking_status: 'pending',
        total_cost: 150.00,
        payment_status: 'unpaid',
        booked_datetime: new Date().toISOString()
    },
    payment: {
        transaction_date: new Date().toISOString(),
        amount: 150.00,
        payment_method: 'card',
        status: 'pending',
        transaction_details: 'Test payment'
    },
    review: {
        rating_score: 5,
        written_review: 'Excellent service!',
        review_date: new Date().toISOString()
    }
};

// Store created IDs for cleanup and relationships
const createdIds = {
    admin: null,
    patient: null,
    nurse: null,
    serviceCategory: null,
    careRequirement: null,
    workSchedule: null,
    document: null,
    booking: null,
    payment: null,
    review: null
};

// Helper functions
function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(testName) {
    console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
    log(`Testing: ${testName}`, 'cyan');
    console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}`);
}

function logSuccess(message) {
    log(`✓ ${message}`, 'green');
}

function logError(message) {
    log(`✗ ${message}`, 'red');
}

function logWarning(message) {
    log(`⚠ ${message}`, 'yellow');
}

async function testEndpoint(method, endpoint, data = null, description = '') {
    try {
        const config = {
            method,
            url: `${BASE_URL}${endpoint}`,
            data
        };

        const response = await axios(config);
        logSuccess(`${description || `${method} ${endpoint}`} - Status: ${response.status}`);
        return { success: true, data: response.data, status: response.status };
    } catch (error) {
        if (error.response) {
            logError(`${description || `${method} ${endpoint}`} - Status: ${error.response.status} - ${error.response.data.message || JSON.stringify(error.response.data)}`);
            return { success: false, error: error.response.data, status: error.response.status };
        } else {
            logError(`${description || `${method} ${endpoint}`} - ${error.message}`);
            return { success: false, error: error.message };
        }
    }
}

// Test functions for each resource
async function testAdminAPI() {
    logTest('ADMIN API');

    // Create admin
    const createResult = await testEndpoint('POST', '/admin/signup', testData.admin, 'Create Admin');
    if (createResult.success && createResult.data.admin && createResult.data.admin.admin_ID) {
        createdIds.admin = createResult.data.admin.admin_ID;
    }

    // Login admin
    await testEndpoint('POST', '/admin/login', {
        username: testData.admin.username,
        password: testData.admin.password
    }, 'Login Admin');

    // Get all admins
    await testEndpoint('GET', '/admin/all', null, 'Get All Admins');

    // Get admin by ID
    if (createdIds.admin) {
        await testEndpoint('GET', `/admin/${createdIds.admin}`, null, 'Get Admin by ID');

        // Update admin
        await testEndpoint('PATCH', `/admin/update/${createdIds.admin}`, {
            first_name: 'Updated'
        }, 'Update Admin');
    }
}

async function testPatientAPI() {
    logTest('PATIENT API');

    // Create patient
    const createResult = await testEndpoint('POST', '/patient/signup', testData.patient, 'Create Patient');
    if (createResult.success && createResult.data.patient && createResult.data.patient.patient_ID) {
        createdIds.patient = createResult.data.patient.patient_ID;
    }

    // Login patient
    await testEndpoint('POST', '/patient/login', {
        username: testData.patient.username,
        password: testData.patient.password
    }, 'Login Patient');

    // Get all patients
    await testEndpoint('GET', '/patient', null, 'Get All Patients');

    // Get patient by ID
    if (createdIds.patient) {
        await testEndpoint('GET', `/patient/${createdIds.patient}`, null, 'Get Patient by ID');

        // Update patient
        await testEndpoint('PATCH', `/patient/update/${createdIds.patient}`, {
            first_name: 'Jonathan'
        }, 'Update Patient');
    }
}

async function testNurseAPI() {
    logTest('NURSE API');

    // Create nurse
    const createResult = await testEndpoint('POST', '/nurse/signup', testData.nurse, 'Create Nurse');
    if (createResult.success && createResult.data.nurse && createResult.data.nurse.nurse_ID) {
        createdIds.nurse = createResult.data.nurse.nurse_ID;
    }

    // Login nurse
    await testEndpoint('POST', '/nurse/login', {
        email: testData.nurse.email,
        password: testData.nurse.password
    }, 'Login Nurse');

    // Get all nurses
    await testEndpoint('GET', '/nurse', null, 'Get All Nurses');

    // Get nurse by ID
    if (createdIds.nurse) {
        await testEndpoint('GET', `/nurse/${createdIds.nurse}`, null, 'Get Nurse by ID');

        // Update nurse
        await testEndpoint('PATCH', `/nurse/update/${createdIds.nurse}`, {
            current_availability: false
        }, 'Update Nurse');
    }
}

async function testServiceCategoryAPI() {
    logTest('SERVICE CATEGORY API');

    // Create service category
    const createResult = await testEndpoint('POST', '/service-category', testData.serviceCategory, 'Create Service Category');
    if (createResult.success && createResult.data.serviceCategory && createResult.data.serviceCategory.category_ID) {
        createdIds.serviceCategory = createResult.data.serviceCategory.category_ID;
    }

    // Get all service categories
    await testEndpoint('GET', '/service-category', null, 'Get All Service Categories');

    // Get service category by ID
    if (createdIds.serviceCategory) {
        await testEndpoint('GET', `/service-category/${createdIds.serviceCategory}`, null, 'Get Service Category by ID');

        // Update service category
        await testEndpoint('PATCH', `/service-category/${createdIds.serviceCategory}`, {
            category_name: 'Advanced Wound Care'
        }, 'Update Service Category');
    }
}

async function testCareRequirementAPI() {
    logTest('CARE REQUIREMENT API');

    if (!createdIds.patient) {
        logWarning('Skipping Care Requirement tests - Patient not created');
        return;
    }

    // Create care requirement
    const careReqData = { ...testData.careRequirement, patient_ID: createdIds.patient };
    const createResult = await testEndpoint('POST', '/care-requirement', careReqData, 'Create Care Requirement');
    if (createResult.success && createResult.data.careRequirement && createResult.data.careRequirement.req_ID) {
        createdIds.careRequirement = createResult.data.careRequirement.req_ID;
    }

    // Get all care requirements
    await testEndpoint('GET', '/care-requirement', null, 'Get All Care Requirements');

    // Get care requirement by ID
    if (createdIds.careRequirement) {
        await testEndpoint('GET', `/care-requirement/${createdIds.careRequirement}`, null, 'Get Care Requirement by ID');

        // Update care requirement
        await testEndpoint('PATCH', `/care-requirement/${createdIds.careRequirement}`, {
            hours_per_day: 6
        }, 'Update Care Requirement');
    }
}

async function testWorkScheduleAPI() {
    logTest('WORK SCHEDULE API');

    if (!createdIds.nurse) {
        logWarning('Skipping Work Schedule tests - Nurse not created');
        return;
    }

    // Create work schedule
    const scheduleData = { ...testData.workSchedule, nurse_ID: createdIds.nurse };
    const createResult = await testEndpoint('POST', '/work-schedule', scheduleData, 'Create Work Schedule');
    if (createResult.success && createResult.data.workSchedule && createResult.data.workSchedule.work_id) {
        createdIds.workSchedule = createResult.data.workSchedule.work_id;
    }

    // Get all work schedules
    await testEndpoint('GET', '/work-schedule', null, 'Get All Work Schedules');

    // Get work schedule by ID
    if (createdIds.workSchedule) {
        await testEndpoint('GET', `/work-schedule/${createdIds.workSchedule}`, null, 'Get Work Schedule by ID');

        // Update work schedule
        await testEndpoint('PATCH', `/work-schedule/${createdIds.workSchedule}`, {
            time_range: '10:00-18:00'
        }, 'Update Work Schedule');
    }
}

async function testDocumentAPI() {
    logTest('DOCUMENT API');

    if (!createdIds.nurse) {
        logWarning('Skipping Document tests - Nurse not created');
        return;
    }

    // Create document
    const docData = { ...testData.document, nurse_ID: createdIds.nurse };
    const createResult = await testEndpoint('POST', '/document', docData, 'Create Document');
    if (createResult.success && createResult.data.document && createResult.data.document.Doc_ID) {
        createdIds.document = createResult.data.document.Doc_ID;
    }

    // Get all documents
    await testEndpoint('GET', '/document', null, 'Get All Documents');

    // Get document by ID
    if (createdIds.document) {
        await testEndpoint('GET', `/document/${createdIds.document}`, null, 'Get Document by ID');

        // Update document
        await testEndpoint('PATCH', `/document/${createdIds.document}`, {
            type: 'diploma'
        }, 'Update Document');
    }
}

async function testBookingAPI() {
    logTest('BOOKING API');

    if (!createdIds.patient || !createdIds.nurse) {
        logWarning('Skipping Booking tests - Patient or Nurse not created');
        return;
    }

    // Create booking
    const bookingData = {
        ...testData.booking,
        patient_ID: createdIds.patient,
        nurse_ID: createdIds.nurse
    };
    const createResult = await testEndpoint('POST', '/booking', bookingData, 'Create Booking');
    if (createResult.success && createResult.data.booking && createResult.data.booking.booking_ID) {
        createdIds.booking = createResult.data.booking.booking_ID;
    }

    // Get all bookings
    await testEndpoint('GET', '/booking', null, 'Get All Bookings');

    // Get booking by ID
    if (createdIds.booking) {
        await testEndpoint('GET', `/booking/${createdIds.booking}`, null, 'Get Booking by ID');

        // Update booking
        await testEndpoint('PATCH', `/booking/${createdIds.booking}`, {
            booking_status: 'confirmed'
        }, 'Update Booking');
    }
}

async function testPaymentAPI() {
    logTest('PAYMENT API');

    if (!createdIds.booking) {
        logWarning('Skipping Payment tests - Booking not created');
        return;
    }

    // Create payment
    const paymentData = { ...testData.payment, booking_ID: createdIds.booking };
    const createResult = await testEndpoint('POST', '/payment', paymentData, 'Create Payment');
    if (createResult.success && createResult.data.payment && createResult.data.payment.payment_ID) {
        createdIds.payment = createResult.data.payment.payment_ID;
    }

    // Get all payments
    await testEndpoint('GET', '/payment', null, 'Get All Payments');

    // Get payment by ID
    if (createdIds.payment) {
        await testEndpoint('GET', `/payment/${createdIds.payment}`, null, 'Get Payment by ID');

        // Update payment
        await testEndpoint('PATCH', `/payment/${createdIds.payment}`, {
            status: 'successful'
        }, 'Update Payment');
    }
}

async function testReviewAPI() {
    logTest('REVIEW API');

    if (!createdIds.patient || !createdIds.nurse || !createdIds.booking) {
        logWarning('Skipping Review tests - Patient, Nurse, or Booking not created');
        return;
    }

    // Create review
    const reviewData = {
        ...testData.review,
        patient_ID: createdIds.patient,
        nurse_ID: createdIds.nurse,
        booking_ID: createdIds.booking
    };
    const createResult = await testEndpoint('POST', '/review', reviewData, 'Create Review');
    if (createResult.success && createResult.data.review && createResult.data.review.review_ID) {
        createdIds.review = createResult.data.review.review_ID;
    }

    // Get all reviews
    await testEndpoint('GET', '/review', null, 'Get All Reviews');

    // Get review by ID
    if (createdIds.review) {
        await testEndpoint('GET', `/review/${createdIds.review}`, null, 'Get Review by ID');

        // Update review
        await testEndpoint('PATCH', `/review/${createdIds.review}`, {
            rating_score: 4
        }, 'Update Review');
    }
}

async function testNurseSkillAPI() {
    logTest('NURSE SKILL API');

    if (!createdIds.nurse || !createdIds.serviceCategory) {
        logWarning('Skipping Nurse Skill tests - Nurse or Service Category not created');
        return;
    }

    // Create nurse skill
    const skillData = {
        nurse_ID: createdIds.nurse,
        category_ID: createdIds.serviceCategory
    };
    await testEndpoint('POST', '/nurse-skill', skillData, 'Create Nurse Skill');

    // Get all nurse skills
    await testEndpoint('GET', '/nurse-skill', null, 'Get All Nurse Skills');

    // Get nurse skill by composite ID
    await testEndpoint('GET', `/nurse-skill/${createdIds.nurse}/${createdIds.serviceCategory}`, null, 'Get Nurse Skill by Composite ID');
}

async function testRequiredServiceAPI() {
    logTest('REQUIRED SERVICE API');

    if (!createdIds.careRequirement || !createdIds.serviceCategory) {
        logWarning('Skipping Required Service tests - Care Requirement or Service Category not created');
        return;
    }

    // Create required service
    const reqServiceData = {
        req_ID: createdIds.careRequirement,
        category_ID: createdIds.serviceCategory
    };
    await testEndpoint('POST', '/required-service', reqServiceData, 'Create Required Service');

    // Get all required services
    await testEndpoint('GET', '/required-service', null, 'Get All Required Services');

    // Get required service by composite ID
    await testEndpoint('GET', `/required-service/${createdIds.careRequirement}/${createdIds.serviceCategory}`, null, 'Get Required Service by Composite ID');
}

// Main test runner
async function runAllTests() {
    console.log('\n');
    log('╔════════════════════════════════════════════════════════════╗', 'blue');
    log('║     PATIENT CARE API - COMPREHENSIVE TEST SUITE           ║', 'blue');
    log('╚════════════════════════════════════════════════════════════╝', 'blue');
    console.log('\n');

    const startTime = Date.now();

    try {
        // Test in order to create dependencies
        await testAdminAPI();
        await testPatientAPI();
        await testNurseAPI();
        await testServiceCategoryAPI();
        await testCareRequirementAPI();
        await testWorkScheduleAPI();
        await testDocumentAPI();
        await testBookingAPI();
        await testPaymentAPI();
        await testReviewAPI();
        await testNurseSkillAPI();
        await testRequiredServiceAPI();

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        console.log('\n');
        log('╔════════════════════════════════════════════════════════════╗', 'blue');
        log('║                    TEST SUMMARY                            ║', 'blue');
        log('╚════════════════════════════════════════════════════════════╝', 'blue');
        log(`\nTotal test duration: ${duration}s`, 'cyan');
        log('\nCreated Resource IDs:', 'yellow');
        Object.entries(createdIds).forEach(([key, value]) => {
            if (value) {
                log(`  ${key}: ${value}`, 'green');
            } else {
                log(`  ${key}: Not created`, 'red');
            }
        });

        console.log('\n');
        log('✓ All tests completed!', 'green');
        log('Note: Some tests may have failed due to database constraints or missing dependencies.', 'yellow');
        log('Check the logs above for detailed results.', 'yellow');
        console.log('\n');

    } catch (error) {
        logError(`\nTest suite failed with error: ${error.message}`);
        console.error(error);
    }
}

// Run tests
runAllTests();
