# Database Migrations

## Overview

This directory contains database migration files for the Patient Care Management System. Migrations are used to manage database schema changes in a version-controlled and reversible manner.

## Migration Files

### 001-add-nurse-fields.js
Adds new fields to the `NURSE` table:
- `years_of_experience` (INTEGER)
- `hourly_rate` (DECIMAL(10, 2))
- `total_reviews` (INTEGER)

### 002-update-booking-fields.js
Adds new fields and statuses to the `BOOKING` table:
- New booking statuses: `pending_nurse_approval`, `in_progress`, `cancelled_by_patient`, `cancelled_by_nurse`, `cancelled_by_admin`
- `start_time` (TIME)
- `end_time` (TIME)
- `duration_hours` (DECIMAL(4, 2))
- `service_category_ID` (STRING(6), FK to SERVICE_CATEGORY)
- `address_ID` (INTEGER, FK to PATIENT_ADDRESS)
- `special_instructions` (TEXT)
- `emergency_contact` (STRING(20))
- `emergency_reported` (BOOLEAN)
- `emergency_reported_at` (DATE)
- `emergency_details` (TEXT)

### 003-create-patient-address-table.js
Creates the `PATIENT_ADDRESS` table with fields:
- `address_ID` (INTEGER, Primary Key, Auto Increment)
- `patient_ID` (STRING(6), FK to PATIENT)
- `label` (STRING(50))
- `house_number` (STRING(50))
- `street_address` (STRING(200))
- `area` (STRING(100))
- `landmark` (STRING(200))
- `postal_code` (STRING(10))
- `contact_person` (STRING(100))
- `contact_phone` (STRING(20))
- `is_default` (BOOLEAN)

### 004-create-notification-table.js
Creates the `NOTIFICATION` table with fields:
- `notification_ID` (INTEGER, Primary Key, Auto Increment)
- `user_ID` (STRING(10), FK to USER)
- `user_type` (ENUM: 'admin', 'nurse', 'patient')
- `type` (STRING(50))
- `title` (STRING(200))
- `message` (TEXT)
- `related_entity_type` (STRING(50))
- `related_entity_ID` (STRING(50))
- `is_read` (BOOLEAN)
- `created_at` (DATE)

### 005-update-document-fields.js
Adds new fields to the `DOCUMENTS` table:
- `issuing_authority` (STRING)
- `issue_date` (DATE)

## Running Migrations

### Run All Pending Migrations

```bash
npm run migrate
```

This will:
1. Connect to the database
2. Create a `SequelizeMeta` table if it doesn't exist (to track completed migrations)
3. Run all pending migrations in order
4. Record completed migrations

### Undo Migrations

To undo the last migration(s):

```bash
npm run migrate:undo
```

This will:
1. Find all completed migrations
2. Run their `down` functions in reverse order
3. Remove them from the migrations table

## Migration Structure

Each migration file exports two functions:

```javascript
module.exports = {
  async up(queryInterface, Sequelize) {
    // Apply migration changes
  },
  async down(queryInterface, Sequelize) {
    // Revert migration changes
  }
};
```

## Best Practices

1. **Always include both `up` and `down` functions** - This ensures migrations are reversible
2. **Test migrations** - Run migrations on a test database first
3. **Don't modify existing migrations** - Create new migrations for changes
4. **Use transactions** - Wrap migration logic in transactions when possible
5. **Backup before running** - Always backup your database before running migrations in production

## Migration Tracking

The system uses a `SequelizeMeta` table to track which migrations have been run. This table stores the filename of each completed migration.

## Troubleshooting

### Migration Fails

If a migration fails:
1. Check the error message
2. Fix the issue in the migration file
3. If the migration partially completed, you may need to manually clean up
4. Re-run the migration

### Migration Already Applied

If you see "migration already applied" errors:
- Check the `SequelizeMeta` table
- Remove the entry if you need to re-run the migration
- Or create a new migration with the changes

### ENUM Type Issues

PostgreSQL doesn't support removing ENUM values easily. If you need to modify ENUM types:
- Create a new ENUM type
- Migrate data
- Drop the old ENUM type

## Notes

- The project currently uses `db.sync({ alter: true })` for development, but migrations are recommended for production
- Migrations are numbered sequentially (001, 002, etc.) to ensure proper execution order
- All migrations are idempotent where possible (safe to run multiple times)
