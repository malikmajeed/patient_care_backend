# Migrations, Seeders, and Tests - Complete Guide

## Overview

This document provides a complete guide to the database migrations, seeders, and test suite for the Patient Care Management System.

## Database Migrations

### Location
All migration files are located in: `src/database/migrations/`

### Available Migrations

1. **001-add-nurse-fields.js**
   - Adds `years_of_experience`, `hourly_rate`, and `total_reviews` to NURSE table

2. **002-update-booking-fields.js**
   - Updates booking status ENUM with new statuses
   - Adds time, duration, service category, address, and emergency fields

3. **003-create-patient-address-table.js**
   - Creates PATIENT_ADDRESS table for managing patient addresses

4. **004-create-notification-table.js**
   - Creates NOTIFICATION table for system notifications

5. **005-update-document-fields.js**
   - Adds `issuing_authority` and `issue_date` to DOCUMENTS table

### Running Migrations

```bash
# Run all pending migrations
npm run migrate

# Undo migrations (runs down functions)
npm run migrate:undo
```

### Migration Runner

The migration runner (`run-migrations.js`) automatically:
- Creates a `SequelizeMeta` table to track completed migrations
- Runs migrations in sequential order
- Prevents duplicate migrations
- Supports rollback functionality

## Database Seeders

### Location
Seeder file: `src/database/seeders/index.js`

### Seeded Data

The seeder creates comprehensive test data including:

#### Users (7 total)
- 1 Admin user (`admin@gmail.com` / `Admin@123`)
- 4 Nurse users (2 verified, 1 pending, 1 expert)
- 2 Patient users

#### Nurses (4 total)
- **NRS001**: Verified, Expert, 10 years experience, $75/hr, 15 reviews, 4.8 rating
- **NRS002**: Verified, Intermediate, 5 years experience, $60/hr, 8 reviews, 4.5 rating
- **NRS003**: **Pending verification**, Beginner, 2 years experience, $45/hr
- **NRS004**: Verified, Expert, 15 years experience, $85/hr, 22 reviews, 4.9 rating

#### Patients (2 total)
- **PAT001**: John Doe
- **PAT002**: Jane Smith

#### Patient Addresses (3 total)
- 2 addresses for PAT001 (Home - default, Work)
- 1 address for PAT002 (Home - default)

#### Bookings (4 total)
- **BKG001**: Completed, 8 hours, Post-Operative Care, $500
- **BKG002**: Pending nurse approval, 6 hours, Elderly Care, $400
- **BKG003**: Confirmed, 10 hours, Medication Management, $600
- **BKG004**: In progress, 6 hours, Pediatric Care, $450

#### Documents (6 total)
- Multiple certifications and diplomas for nurses
- Includes documents for pending nurse (NRS003)

#### Notifications (5 total)
- Booking requests
- Booking confirmations
- Verification pending alerts
- Review notifications

#### Additional Data
- 8 Service Categories
- 6 Nurse Skills (linking nurses to categories)
- 2 Care Requirements
- 3 Required Services
- 2 Payments
- 2 Reviews
- 6 Work Schedules

### Running Seeders

```bash
# Run seeders (clears existing data and seeds fresh data)
npm run seed
```

**Note**: The seeder will **delete all existing data** before seeding. Use with caution in production!

### Test Credentials

After seeding, you can use these credentials:

- **Admin**: `admin@gmail.com` / `Admin@123`
- **Patient 1**: `patient1@example.com` / `Patient@123`
- **Patient 2**: `patient2@example.com` / `Patient@123`
- **Nurse 1**: `nurse1@example.com` / `Nurse@123`
- **Nurse 2**: `nurse2@example.com` / `Nurse@123`
- **Nurse 3** (Pending): `nurse3@example.com` / `Nurse@123`
- **Nurse 4**: `nurse4@example.com` / `Nurse@123`

## Test Suite

### Location
Test file: `tests/api.test.js`

### Test Coverage

The test suite covers:

1. **Authentication Tests**
   - Admin login
   - Patient login
   - Nurse login

2. **Nurse Endpoints**
   - Get all nurses
   - Search nurses with filters
   - Get nurse availability

3. **Booking Endpoints**
   - Create booking request
   - Get patient bookings
   - Update booking status

4. **Address Endpoints**
   - Get patient addresses
   - Create patient address

5. **Notification Endpoints**
   - Get notifications
   - Mark notification as read

6. **Review Endpoints**
   - Create review

7. **Work Schedule Endpoints**
   - Get nurse schedule

8. **Admin Endpoints**
   - Get dashboard stats
   - Get analytics

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch
```

### Prerequisites for Tests

1. **Backend server must be running**:
   ```bash
   npm run dev
   ```

2. **Database must be seeded**:
   ```bash
   npm run seed
   ```

3. **Environment variable** (optional):
   ```bash
   API_URL=http://localhost:5000/api npm test
   ```

### Test Output

The test suite provides:
- Color-coded output (✓ green for pass, ✗ red for fail)
- Detailed error messages with API response data
- Test summary with pass/fail counts
- Execution time

### Example Output

```
============================================================
PATIENT CARE MANAGEMENT SYSTEM - API TEST SUITE
============================================================
Base URL: http://localhost:5000/api
Start Time: 2024-12-20T10:00:00.000Z

============================================================
Testing: Authentication
============================================================
✓ Admin Login
✓ Patient Login
✓ Nurse Login

============================================================
Testing: Nurse Endpoints
============================================================
✓ Get All Nurses
✓ Search Nurses
✓ Get Nurse Availability

...

============================================================
TEST SUMMARY
============================================================
Total Tests: 20
Passed: 20
Failed: 0
============================================================
```

## Complete Setup Workflow

### Initial Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Run migrations** (optional, if not using sync):
   ```bash
   npm run migrate
   ```

4. **Seed database**:
   ```bash
   npm run seed
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

6. **Run tests** (in another terminal):
   ```bash
   npm test
   ```

### Development Workflow

1. Make schema changes in models
2. Create migration file if needed
3. Run migration: `npm run migrate`
4. Update seeders if needed: `npm run seed`
5. Run tests: `npm test`

### Production Deployment

1. **Backup database**
2. **Run migrations**:
   ```bash
   npm run migrate
   ```
3. **Verify with tests** (on staging):
   ```bash
   npm test
   ```
4. **Deploy**

## Troubleshooting

### Migration Issues

- **Error: Migration already applied**: Check `SequelizeMeta` table
- **Error: Cannot add column**: Column may already exist, check schema
- **Error: ENUM value exists**: PostgreSQL ENUM modifications require special handling

### Seeder Issues

- **Error: Foreign key constraint**: Ensure parent records exist (Users before Nurses/Patients)
- **Error: Duplicate key**: Clear existing data first or modify seeder
- **Error: Invalid date**: Check date format in seeder

### Test Issues

- **Error: Connection refused**: Ensure backend server is running
- **Error: 401 Unauthorized**: Check test credentials match seeded data
- **Error: 404 Not Found**: Verify API routes are registered correctly

## File Structure

```
patient_care_backend/
├── src/
│   └── database/
│       ├── migrations/
│       │   ├── 001-add-nurse-fields.js
│       │   ├── 002-update-booking-fields.js
│       │   ├── 003-create-patient-address-table.js
│       │   ├── 004-create-notification-table.js
│       │   ├── 005-update-document-fields.js
│       │   ├── run-migrations.js
│       │   └── README.md
│       └── seeders/
│           └── index.js
├── tests/
│   ├── api.test.js
│   └── README.md
└── package.json
```

## Additional Resources

- **Migration Documentation**: `src/database/migrations/README.md`
- **Test Documentation**: `tests/README.md`
- **System Documentation**: `../SYSTEM_DOCUMENTATION.md`

## Notes

- The project uses `db.sync({ alter: true })` for development, which automatically updates the schema
- Migrations are recommended for production environments
- Seeders clear all data before seeding - use with caution!
- Tests require a running server and seeded database
- All test data uses predictable IDs for consistency
