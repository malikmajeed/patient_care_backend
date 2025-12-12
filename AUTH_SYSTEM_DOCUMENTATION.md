# Authentication System Documentation

## Overview

This is a **stateful, secure authentication system** using **HTTP-only cookies** for all user types (Admin, Patient, Nurse). The system implements JWT-based authentication with access and refresh tokens, session management, and comprehensive security features, centralized around a unified `User` model.

## Architecture

### Key Components

1.  **Unified User Model**:
    *   Central `User` table stores common credentials (`username`, `email`, `password_hash`) and profile data (`first_name`, `last_name`, `gender`, `phone_number`).
    *   Role-specific tables (`Patient`, `Admin`, `Nurse`) link to the `User` table via `user_ID` and store only role-specific attributes.

2.  **JWT Tokens**:
    *   **Access Token**: Short-lived (15 minutes), stored in HTTP-only cookie. Contains `user_id`, `role`, and `user_type`.
    *   **Refresh Token**: Long-lived (7 days), stored in HTTP-only cookie.
    *   Separate secrets for access and refresh tokens.

3.  **Session Management**:
    *   Sessions stored in database with refresh tokens.
    *   Track user sessions with IP address and user agent.
    *   Support for multiple active sessions per user.
    *   Automatic cleanup of expired sessions.

### Features

#### ✅ Security Features
*   **HTTP-Only Cookies**: Prevents XSS attacks.
*   **Secure Flag**: HTTPS-only in production.
*   **SameSite Protection**: CSRF protection.
*   **Token Rotation**: New access token on refresh.
*   **Session Tracking**: Monitor active sessions.
*   **Role-Based Access Control**: Granular permissions (Admin, Nurse, Patient).

#### ✅ User Management
*   **Centralized Authentication**: Single controller `user.auth.controller.js` handles logic for all roles.
*   **Role-Specific Provisioning**: Specialized signup routes (`/admin/signup`, `/patient/signup`, `/nurse/signup`) that populate the `User` table and the respective role table.
*   **Unified Login**: Single login logic that intelligently fetches the correct profile based on the user's role.

## API Endpoints

### Base URL: `/api/auth`

| Endpoint | Method | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `/login` | POST | No | Generic login for all users. |
| `/logout` | POST | No | Logout current session. |
| `/refresh` | POST | No | Refresh access token. |
| `/profile` | GET | Yes | Get current user's profile. |
| `/sessions` | GET | Yes | Get active sessions. |
| `/logout-all` | POST | Yes | Logout to all devices. |
| `/verify` | GET | Yes | Verify authentication status. |
| `/admin/signup` | POST | No | Register a new Admin. |
| `/patient/signup` | POST | No | Register a new Patient. |
| `/nurse/signup` | POST | No | Register a new Nurse. |

## Usage Examples

### 1. User Login (Any Role)

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "username": "patient1",
    "password": "SecurePass123!"
  }'
```

**Response:**
*   Sets `accessToken` cookie (HttpOnly, 15 min).
*   Sets `refreshToken` cookie (HttpOnly, 7 days).
*   Returns unified user object (User details + Role-specific details).

### 2. Patient Signup

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

### 3. Get Profile

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -b cookies.txt
```

## Database Schema

### User Table (Central)
*   `user_ID` (PK)
*   `username`
*   `email`
*   `password_hash`
*   `role` (ENUM: 'admin', 'nurse', 'patient')
*   `first_name`, `last_name`, `gender`, `phone_number`

### Role Tables (Patient, Nurse, Admin)
*   `[role]_ID` (PK)
*   `user_ID` (FK -> User.user_ID)
*   *...Role specific fields...*

## File Structure

```
src/
├── controllers/
│   └── user.auth.controller.js     # Centralized auth logic
├── routes/
│   └── user.auth.routes.js         # Unified auth routes
├── services/
│   ├── auth.service.js             # Token & Session logic
│   ├── patient.service.js          # Patient logic (calls User model)
│   ├── admin.service.js            # Admin logic (calls User model)
│   └── nurse.service.js            # Nurse logic (calls User model)
├── models/
│   ├── user.model.js               # Base User schema
│   └── [role].model.js             # Role-specific extensions
└── middlewares/
    └── auth.middleware.js          # Auth verification
```
