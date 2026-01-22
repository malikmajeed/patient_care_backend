# Test Suite Documentation

## Overview

This test suite provides comprehensive testing for the Patient Care Management System API endpoints.

## Running Tests

### Prerequisites

1. Ensure the backend server is running:
   ```bash
   npm run dev
   ```

2. Ensure the database is seeded with test data:
   ```bash
   npm run seed
   ```

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

## Test Coverage

The test suite covers the following areas:

### Authentication
- Admin login
- Patient login
- Nurse login

### Nurse Endpoints
- Get all nurses
- Search nurses with filters
- Get nurse availability

### Booking Endpoints
- Create booking request
- Get patient bookings
- Update booking status

### Address Endpoints
- Get patient addresses
- Create patient address

### Notification Endpoints
- Get notifications
- Mark notification as read

### Review Endpoints
- Create review

### Work Schedule Endpoints
- Get nurse schedule

### Admin Endpoints
- Get dashboard stats
- Get analytics

## Test Data

The tests use seeded data from the database seeders:
- Admin: `admin@gmail.com` / `Admin@123`
- Patient: `patient1@example.com` / `Patient@123`
- Nurse: `nurse1@example.com` / `Nurse@123`

## Environment Variables

The test suite uses the following environment variable:
- `API_URL`: Base URL for the API (default: `http://localhost:5000/api`)

## Test Output

The test suite provides:
- Color-coded output (green for pass, red for fail)
- Detailed error messages
- Test summary with pass/fail counts

## Adding New Tests

To add new tests:

1. Create a new test function following the pattern:
   ```javascript
   async function testNewFeature() {
       logTest('New Feature');
       await runner.run('Test Name', async () => {
           // Test code here
       });
   }
   ```

2. Call the test function in `runAllTests()`:
   ```javascript
   await testNewFeature();
   ```

## Troubleshooting

### Tests Failing

1. Check that the server is running
2. Verify database connection
3. Ensure seeders have been run
4. Check API endpoint URLs match your configuration

### Authentication Errors

- Verify test credentials match seeded data
- Check JWT token generation is working
- Ensure auth middleware is properly configured
