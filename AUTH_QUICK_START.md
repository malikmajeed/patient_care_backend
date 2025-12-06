# Quick Start Guide - Authentication System

## Setup Steps

### 1. Install Dependencies

Already installed:
- `jsonwebtoken` - JWT token generation and verification
- `cookie-parser` - Parse HTTP cookies
- `bcrypt` - Password hashing

### 2. Update Environment Variables

Add these to your `.env` file:

```env
# JWT Secrets (Generate strong secrets for production!)
JWT_ACCESS_SECRET=your_access_token_secret_key_change_this
JWT_REFRESH_SECRET=your_refresh_token_secret_key_change_this

# Client URL for CORS
CLIENT_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
```

**Generate Strong Secrets:**
```bash
# On Mac/Linux
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Sync Database

The Session model needs to be added to your database. Update your database sync file:

```javascript
// In your database initialization file
const Session = require('./models/session.model');

// Sync all models
await db.sync({ alter: true });
```

### 4. Test the System

#### Test Admin Signup
```bash
curl -X POST http://localhost:5000/api/auth/admin/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin1",
    "email": "admin@test.com",
    "password": "Test123!",
    "first_name": "Admin",
    "last_name": "User"
  }'
```

#### Test Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "username": "admin1",
    "password": "Test123!"
  }'
```

#### Test Protected Route
```bash
curl -X GET http://localhost:5000/api/auth/admin/profile \
  -b cookies.txt
```

#### Test Patient Signup
```bash
curl -X POST http://localhost:5000/api/auth/patient/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "patient1",
    "email": "patient@test.com",
    "password": "Test123!",
    "first_name": "Patient",
    "last_name": "User",
    "gender": "male",
    "phone_number": "+1234567890"
  }'
```

#### Test Patient Login
```bash
curl -X POST http://localhost:5000/api/auth/patient/login \
  -H "Content-Type: application/json" \
  -c patient_cookies.txt \
  -d '{
    "username": "patient1",
    "password": "Test123!"
  }'
```

## What's New

### Files Created

1. **Models**
   - `src/models/session.model.js` - Session storage

2. **Config**
   - `src/config/cookie.config.js` - Cookie settings
   - Updated `src/config/jwt.config.js` - JWT configuration

3. **Services**
   - `src/services/auth.service.js` - Auth business logic
   - `src/services/session.service.js` - Session management

4. **Controllers**
   - `src/controllers/admin.auth.controller.js` - Admin auth
   - `src/controllers/patient.auth.controller.js` - Patient auth

5. **Routes**
   - `src/routes/admin.auth.routes.js` - Admin auth routes
   - `src/routes/patient.auth.routes.js` - Patient auth routes

6. **Middleware**
   - Updated `src/middlewares/auth.middleware.js` - Complete auth middleware

7. **Utils**
   - Updated `src/utils/jwt.utils.js` - Enhanced JWT utilities

8. **Documentation**
   - `AUTH_SYSTEM_DOCUMENTATION.md` - Full documentation
   - `.env.example` - Environment variables template

### Files Updated

- `src/app.js` - Added cookie-parser and auth routes
- `src/config/jwt.config.js` - Enhanced configuration
- `src/utils/jwt.utils.js` - Complete rewrite
- `src/middlewares/auth.middleware.js` - Complete rewrite

## Key Features

✅ **HTTP-Only Cookies** - Secure token storage
✅ **Stateful Sessions** - Database-backed sessions
✅ **Dual User Types** - Admin and Patient auth
✅ **Token Refresh** - Automatic token renewal
✅ **Multi-Device Support** - Multiple active sessions
✅ **Role-Based Access** - Admin role hierarchy
✅ **Session Management** - View and revoke sessions
✅ **CORS Configured** - Ready for frontend integration

## Next Steps

1. **Update .env file** with the new variables
2. **Sync database** to create Session table
3. **Test endpoints** using the examples above
4. **Integrate with frontend** using the examples in AUTH_SYSTEM_DOCUMENTATION.md
5. **Protect existing routes** using the auth middleware

## Protecting Existing Routes

### Example: Protect Patient Routes

```javascript
// src/routes/patient.routes.js
const { authenticate, isPatient, isResourceOwner } = require('../middlewares/auth.middleware');

// Get all patients - Admin only
router.get('/', authenticate, isAdmin, patientController.getAllPatients);

// Get patient by ID - Owner or Admin
router.get('/:id', authenticate, isResourceOwner, patientController.getPatientById);

// Update patient - Owner or Admin
router.put('/:id', authenticate, isResourceOwner, patientController.update);

// Delete patient - Admin only
router.delete('/:id', authenticate, isAdmin, patientController.deletePatient);
```

### Example: Protect Admin Routes

```javascript
// src/routes/admin.routes.js
const { authenticate, isAdmin, hasAdminRole } = require('../middlewares/auth.middleware');

// Get all admins - Admin only
router.get('/', authenticate, isAdmin, adminController.getAllAdmins);

// Create admin - Superadmin only
router.post('/', authenticate, hasAdminRole('superadmin'), adminController.create);

// Delete admin - Superadmin only
router.delete('/:id', authenticate, hasAdminRole('superadmin'), adminController.deleteAdmin);
```

## Middleware Options

- `authenticate` - Require valid access token
- `isAdmin` - Require admin user type
- `isPatient` - Require patient user type
- `hasAdminRole(...roles)` - Require specific admin role(s)
- `isResourceOwner` - Allow owner or admin
- `optionalAuth` - Optional authentication

## Common Issues

### Issue: Cookies not being set
**Solution**: Check CORS configuration and ensure frontend uses `credentials: 'include'`

### Issue: 401 on protected routes
**Solution**: Verify access token is valid and not expired. Try refreshing token.

### Issue: Database error
**Solution**: Run database sync to create Session table

## Support

See `AUTH_SYSTEM_DOCUMENTATION.md` for detailed documentation, examples, and troubleshooting.

---

**Ready to use!** 🚀
