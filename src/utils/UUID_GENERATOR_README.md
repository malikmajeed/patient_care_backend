# UUID Generator Utility

This utility provides UUID generation functions for all database tables except Patient, Admin, and Nurse (which use the sequential ID generator in `id_genrator.js`).

## Overview

The UUID generator creates unique 6-character identifiers using the following format:
- **2-character prefix** (identifies the table/entity type)
- **4 random alphanumeric characters** (from UUID v4)

Example: `BK3F2A`, `PY7B9C`, `SC1D4E`

## Installation

The utility requires the `uuid` package:

```bash
npm install uuid
```

## Usage

Import the required generator function(s):

```javascript
const { 
    generateBookingId,
    generatePaymentId,
    generateServiceCategoryId,
    generateWorkScheduleId,
    generateDocumentId,
    generateCareRequirementId,
    generateReviewId
} = require('./utils/uuid_generator');
```

### Example Usage in Services

```javascript
// In booking.service.js
const { generateBookingId } = require('../utils/uuid_generator');

const createBooking = async (bookingData) => {
    const booking_ID = await generateBookingId();
    
    const booking = await Booking.create({
        booking_ID,
        ...bookingData
    });
    
    return booking;
};
```

## Available Functions

### 1. `generateBookingId()`
- **Prefix:** `BK`
- **Table:** BOOKING
- **Field:** `booking_ID`
- **Example:** `BK3F2A`

```javascript
const bookingId = await generateBookingId();
```

### 2. `generatePaymentId()`
- **Prefix:** `PY`
- **Table:** PAYMENT
- **Field:** `payment_ID`
- **Example:** `PY7B9C`

```javascript
const paymentId = await generatePaymentId();
```

### 3. `generateServiceCategoryId()`
- **Prefix:** `SC`
- **Table:** SERVICE_CATEGORY
- **Field:** `category_ID`
- **Example:** `SC1D4E`

```javascript
const categoryId = await generateServiceCategoryId();
```

### 4. `generateWorkScheduleId()`
- **Prefix:** `WS`
- **Table:** WORK
- **Field:** `work_id`
- **Example:** `WS2E5F`

```javascript
const workId = await generateWorkScheduleId();
```

### 5. `generateDocumentId()`
- **Prefix:** `DC`
- **Table:** DOCUMENTS
- **Field:** `doc_ID`
- **Example:** `DC8G3H`

```javascript
const docId = await generateDocumentId();
```

### 6. `generateCareRequirementId()`
- **Prefix:** `CR`
- **Table:** CARE_REQUIREMENT
- **Field:** `req_ID`
- **Example:** `CR4H6I`

```javascript
const reqId = await generateCareRequirementId();
```

### 7. `generateReviewId()`
- **Prefix:** `RV`
- **Table:** REVIEW
- **Field:** `review_ID`
- **Example:** `RV9J2K`

```javascript
const reviewId = await generateReviewId();
```

## Tables Using Sequential IDs

The following tables use the sequential ID generator (`id_genrator.js`) instead:

- **Patient** - `PT0001`, `PT0002`, etc.
- **Admin** - `AD0001`, `AD0002`, etc.
- **Nurse** - `NR0001`, `NR0002`, etc.

## Tables with Composite Keys

The following junction tables use composite primary keys and don't need ID generation:

- **NURSE_SKILL** - Composite key: (`nurse_ID`, `category_ID`)
- **REQUIRED_SERVICE** - Composite key: (`req_ID`, `category_ID`)

## How It Works

1. **UUID Generation**: Uses `uuid.v4()` to generate a random UUID
2. **Formatting**: Removes hyphens and takes the first 4 characters, converted to uppercase
3. **Prefix Addition**: Adds the 2-character table prefix
4. **Uniqueness Check**: Queries the database to ensure the ID doesn't already exist
5. **Retry Logic**: If collision detected, generates a new UUID and tries again

## Error Handling

The generator includes error handling for database issues:

```javascript
try {
    const id = await generateBookingId();
} catch (error) {
    console.error('Failed to generate booking ID:', error.message);
}
```

## Custom UUID Generation

For custom use cases, you can use the base `generateUUID` function:

```javascript
const { generateUUID } = require('./utils/uuid_generator');
const CustomModel = require('./models/custom.model');

const customId = await generateUUID(CustomModel, 'custom_id_field', 'CU');
// Returns: CU + 4 random chars, e.g., CU5K7L
```

## Advantages of UUID Approach

1. **Uniqueness**: Extremely low collision probability
2. **Security**: Non-sequential IDs prevent enumeration attacks
3. **Scalability**: Can be generated independently across distributed systems
4. **Performance**: No need to query for the last ID before generation
5. **Flexibility**: Easy to add new tables without modifying existing logic

## Migration from Sequential IDs

If you need to migrate existing tables from sequential to UUID:

1. Update the model to accept the new ID format
2. Update the service to use the UUID generator
3. Run a migration script to update existing records
4. Update any foreign key references

## Testing

To test the UUID generator:

```javascript
const { generateBookingId } = require('./utils/uuid_generator');

// Test uniqueness
const ids = new Set();
for (let i = 0; i < 1000; i++) {
    const id = await generateBookingId();
    ids.add(id);
}
console.log(`Generated ${ids.size} unique IDs`); // Should be 1000
```

## Notes

- All generated IDs are exactly 6 characters long
- IDs are case-sensitive (uppercase letters used)
- The 4-character random portion provides 16^4 = 65,536 possible combinations per prefix
- Collision handling ensures uniqueness even in high-volume scenarios
