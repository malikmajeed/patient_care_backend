# Authentication System Documentation

## Overview

This is a **stateful, secure authentication system** using **HTTP-only cookies** for both Admin and Patient users. The system implements JWT-based authentication with access and refresh tokens, session management, and comprehensive security features.

## Architecture

### Key Components

1. **JWT Tokens**
   - **Access Token**: Short-lived (15 minutes), stored in HTTP-only cookie
   - **Refresh Token**: Long-lived (7 days), stored in HTTP-only cookie
   - Separate secrets for access and refresh tokens

2. **Session Management**
   - Sessions stored in database with refresh tokens
   - Track user sessions with IP address and user agent
   - Support for multiple active sessions per user
   - Automatic cleanup of expired sessions

3. **HTTP-Only Cookies**
   - Secure cookie configuration
   - SameSite protection
   - Automatic HTTPS in production
   - Separate paths for access and refresh tokens

## Features

### ✅ Security Features

- **HTTP-Only Cookies**: Prevents XSS attacks
- **Secure Flag**: HTTPS-only in production
- **SameSite Protection**: CSRF protection
- **Token Rotation**: New access token on refresh
- **Session Tracking**: Monitor active sessions
- **Role-Based Access Control**: Admin roles (superadmin, manager, staff)
- **Resource Ownership**: Users can only access their own resources

### ✅ User Management

- Separate authentication flows for Admin and Patient
- User type identification in JWT payload
- Profile management
- Multi-device session management
- Logout from all devices

## API Endpoints

### Admin Authentication

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/api/auth/admin/signup` | POST | No | Register new admin |
| `/api/auth/admin/login` | POST | No | Admin login |
| `/api/auth/admin/logout` | POST | No | Logout current session |
| `/api/auth/admin/refresh` | POST | No | Refresh access token |
| `/api/auth/admin/logout-all` | POST | Yes | Logout from all devices |
| `/api/auth/admin/profile` | GET | Yes | Get current admin profile |
| `/api/auth/admin/sessions` | GET | Yes | Get active sessions |
| `/api/auth/admin/verify` | GET | Yes | Verify authentication |

### Patient Authentication

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/api/auth/patient/signup` | POST | No | Register new patient |
| `/api/auth/patient/login` | POST | No | Patient login |
| `/api/auth/patient/logout` | POST | No | Logout current session |
| `/api/auth/patient/refresh` | POST | No | Refresh access token |
| `/api/auth/patient/logout-all` | POST | Yes | Logout from all devices |
| `/api/auth/patient/profile` | GET | Yes | Get current patient profile |
| `/api/auth/patient/sessions` | GET | Yes | Get active sessions |
| `/api/auth/patient/verify` | GET | Yes | Verify authentication |

## Usage Examples

### 1. Admin Signup

```bash
curl -X POST http://localhost:5000/api/auth/admin/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin1",
    "email": "admin@example.com",
    "password": "SecurePass123!",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### 2. Admin Login

```bash
curl -X POST http://localhost:5000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "username": "admin1",
    "password": "SecurePass123!"
  }'
```

**Response:**
- Sets `accessToken` cookie (HttpOnly, 15 min)
- Sets `refreshToken` cookie (HttpOnly, 7 days)
- Returns user data

### 3. Access Protected Route

```bash
curl -X GET http://localhost:5000/api/auth/admin/profile \
  -b cookies.txt
```

### 4. Refresh Access Token

```bash
curl -X POST http://localhost:5000/api/auth/admin/refresh \
  -b cookies.txt \
  -c cookies.txt
```

### 5. Logout

```bash
curl -X POST http://localhost:5000/api/auth/admin/logout \
  -b cookies.txt
```

### 6. Patient Signup

```bash
curl -X POST http://localhost:5000/api/auth/patient/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "patient1",
    "email": "patient@example.com",
    "password": "SecurePass123!",
    "first_name": "Jane",
    "last_name": "Smith",
    "gender": "female",
    "phone_number": "+1234567890"
  }'
```

## Frontend Integration

### JavaScript/Fetch Example

```javascript
// Login
async function login(username, password) {
  const response = await fetch('http://localhost:5000/api/auth/patient/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Important: Include cookies
    body: JSON.stringify({ username, password })
  });
  
  const data = await response.json();
  return data;
}

// Access protected route
async function getProfile() {
  const response = await fetch('http://localhost:5000/api/auth/patient/profile', {
    method: 'GET',
    credentials: 'include' // Important: Include cookies
  });
  
  const data = await response.json();
  return data;
}

// Refresh token
async function refreshToken() {
  const response = await fetch('http://localhost:5000/api/auth/patient/refresh', {
    method: 'POST',
    credentials: 'include'
  });
  
  const data = await response.json();
  return data;
}

// Logout
async function logout() {
  const response = await fetch('http://localhost:5000/api/auth/patient/logout', {
    method: 'POST',
    credentials: 'include'
  });
  
  const data = await response.json();
  return data;
}
```

### Axios Example

```javascript
import axios from 'axios';

// Configure axios to include cookies
axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

// Login
const login = async (username, password) => {
  const response = await api.post('/auth/patient/login', {
    username,
    password
  });
  return response.data;
};

// Get profile
const getProfile = async () => {
  const response = await api.get('/auth/patient/profile');
  return response.data;
};

// Refresh token interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await api.post('/auth/patient/refresh');
        return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

## Middleware Usage

### Protect Routes

```javascript
const { authenticate, isAdmin, isPatient, hasAdminRole, isResourceOwner } = require('./middlewares/auth.middleware');

// Require authentication
router.get('/protected', authenticate, controller.handler);

// Admin only
router.get('/admin-only', authenticate, isAdmin, controller.handler);

// Patient only
router.get('/patient-only', authenticate, isPatient, controller.handler);

// Specific admin role
router.delete('/critical', authenticate, hasAdminRole('superadmin'), controller.handler);

// Resource owner or admin
router.put('/user/:id', authenticate, isResourceOwner, controller.handler);
```

## Database Schema

### Session Table

```sql
CREATE TABLE SESSION (
  session_id UUID PRIMARY KEY,
  user_id VARCHAR(6) NOT NULL,
  user_type ENUM('admin', 'patient') NOT NULL,
  refresh_token TEXT NOT NULL,
  ip_address VARCHAR,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_session_user ON SESSION(user_id, user_type);
CREATE INDEX idx_session_token ON SESSION(refresh_token);
CREATE INDEX idx_session_expires ON SESSION(expires_at);
```

## Environment Variables

Add these to your `.env` file:

```env
# JWT Secrets (IMPORTANT: Use strong, unique secrets in production!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_ACCESS_SECRET=your_access_token_secret_key_change_this
JWT_REFRESH_SECRET=your_refresh_token_secret_key_change_this

# Server Configuration
PORT=5000
NODE_ENV=development

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000
```

## Security Best Practices

### ✅ Implemented

1. **HTTP-Only Cookies**: Tokens not accessible via JavaScript
2. **Secure Flag**: Cookies only sent over HTTPS in production
3. **SameSite**: Protection against CSRF attacks
4. **Token Expiration**: Short-lived access tokens
5. **Refresh Token Rotation**: New tokens on refresh
6. **Session Tracking**: Monitor and invalidate sessions
7. **Password Hashing**: bcrypt for password storage
8. **CORS Configuration**: Restricted origins

### 🔒 Production Recommendations

1. **Use HTTPS**: Always use HTTPS in production
2. **Strong Secrets**: Use cryptographically secure random strings for JWT secrets
3. **Rate Limiting**: Implement rate limiting on auth endpoints
4. **Account Lockout**: Lock accounts after failed login attempts
5. **2FA**: Consider implementing two-factor authentication
6. **Audit Logging**: Log all authentication events
7. **Regular Cleanup**: Run session cleanup regularly
8. **Monitor Sessions**: Alert on suspicious session activity

## Token Lifecycle

```
┌─────────────┐
│   Login     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  Generate Access + Refresh      │
│  Store in HTTP-Only Cookies     │
│  Create Session in DB           │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Access Token Valid (15 min)    │
│  Make API Requests              │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Access Token Expired           │
│  Use Refresh Token              │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Validate Refresh Token         │
│  Check Session in DB            │
│  Generate New Access Token      │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Continue Using API             │
└─────────────────────────────────┘
```

## Troubleshooting

### Cookies Not Being Set

1. Check CORS configuration includes `credentials: true`
2. Verify frontend sends `credentials: 'include'`
3. Ensure domain matches (localhost vs 127.0.0.1)

### 401 Unauthorized

1. Check if access token is expired
2. Try refreshing the token
3. Verify cookie is being sent in request

### CORS Errors

1. Add your frontend URL to `CLIENT_URL` in `.env`
2. Ensure `credentials: true` in CORS config
3. Check browser console for specific CORS error

## File Structure

```
src/
├── config/
│   ├── cookie.config.js      # Cookie settings
│   └── jwt.config.js          # JWT configuration
├── controllers/
│   ├── admin.auth.controller.js    # Admin auth endpoints
│   └── patient.auth.controller.js  # Patient auth endpoints
├── middlewares/
│   └── auth.middleware.js     # Authentication middleware
├── models/
│   └── session.model.js       # Session database model
├── routes/
│   ├── admin.auth.routes.js   # Admin auth routes
│   └── patient.auth.routes.js # Patient auth routes
├── services/
│   ├── auth.service.js        # Auth business logic
│   └── session.service.js     # Session management
└── utils/
    └── jwt.utils.js           # JWT utilities
```

## Testing

Run the server and test with curl or Postman. Make sure to:

1. Enable cookie storage in your HTTP client
2. Set `credentials: 'include'` in fetch/axios
3. Check response headers for Set-Cookie
4. Verify cookies are sent in subsequent requests

## Support

For issues or questions:
1. Check this documentation
2. Review error messages in server logs
3. Verify environment variables are set correctly
4. Ensure database is running and accessible

---

**Last Updated**: December 2025
**Version**: 1.0.0
