# Authentication Flow Diagrams

## 1. Login Flow

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       │ POST /api/auth/{admin|patient}/login
       │ { username, password }
       ▼
┌─────────────────────────────────────┐
│     Auth Controller                 │
│  - Validate credentials             │
│  - Call service.login()             │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│     Service Layer                   │
│  - Find user by username/email      │
│  - Compare password hash            │
│  - Return user object               │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│     Auth Service                    │
│  - Generate access token (15min)    │
│  - Generate refresh token (7days)   │
│  - Create session in database       │
│  - Set HTTP-only cookies            │
└──────┬──────────────────────────────┘
       │
       │ Response with cookies:
       │ - accessToken (HttpOnly, 15min)
       │ - refreshToken (HttpOnly, 7days)
       ▼
┌─────────────┐
│   Client    │
│  (Browser)  │
│  Cookies    │
│  Stored     │
└─────────────┘
```

## 2. Accessing Protected Routes

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       │ GET /api/auth/{admin|patient}/profile
       │ Cookie: accessToken=xxx; refreshToken=yyy
       ▼
┌─────────────────────────────────────┐
│     Auth Middleware                 │
│  - Extract accessToken from cookie  │
│  - Verify JWT signature             │
│  - Check expiration                 │
└──────┬──────────────────────────────┘
       │
       ├─── Valid Token ───────────────┐
       │                               │
       │                               ▼
       │                    ┌─────────────────────┐
       │                    │  Attach user to req │
       │                    │  req.user = {       │
       │                    │    user_id,         │
       │                    │    user_type,       │
       │                    │    role             │
       │                    │  }                  │
       │                    └──────┬──────────────┘
       │                           │
       │                           ▼
       │                    ┌─────────────────────┐
       │                    │  Controller Handler │
       │                    │  - Process request  │
       │                    │  - Return response  │
       │                    └──────┬──────────────┘
       │                           │
       │                           ▼
       │                    ┌─────────────────────┐
       │                    │   Success Response  │
       │                    └─────────────────────┘
       │
       └─── Invalid/Expired Token ────┐
                                      │
                                      ▼
                           ┌─────────────────────┐
                           │  401 Unauthorized   │
                           │  "Token expired"    │
                           └─────────────────────┘
```

## 3. Token Refresh Flow

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       │ Access token expired (401)
       │
       ▼
┌─────────────────────────────────────┐
│  Client detects 401                 │
│  Automatically calls refresh        │
└──────┬──────────────────────────────┘
       │
       │ POST /api/auth/{admin|patient}/refresh
       │ Cookie: refreshToken=xxx
       ▼
┌─────────────────────────────────────┐
│     Auth Service                    │
│  - Extract refreshToken from cookie │
│  - Verify JWT signature             │
│  - Check session in database        │
└──────┬──────────────────────────────┘
       │
       ├─── Valid Refresh Token ───────┐
       │                               │
       │                               ▼
       │                    ┌─────────────────────┐
       │                    │  Generate new       │
       │                    │  access token       │
       │                    │  (15 min)           │
       │                    └──────┬──────────────┘
       │                           │
       │                           ▼
       │                    ┌─────────────────────┐
       │                    │  Update cookie      │
       │                    │  accessToken=new    │
       │                    └──────┬──────────────┘
       │                           │
       │                           ▼
       │                    ┌─────────────────────┐
       │                    │  Return success     │
       │                    │  Retry original req │
       │                    └─────────────────────┘
       │
       └─── Invalid Refresh Token ────┐
                                      │
                                      ▼
                           ┌─────────────────────┐
                           │  401 Unauthorized   │
                           │  Redirect to login  │
                           └─────────────────────┘
```

## 4. Logout Flow

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       │ POST /api/auth/{admin|patient}/logout
       │ Cookie: refreshToken=xxx
       ▼
┌─────────────────────────────────────┐
│     Auth Service                    │
│  - Extract refreshToken from cookie │
│  - Find session in database         │
│  - Mark session as inactive         │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│     Clear Cookies                   │
│  - Clear accessToken cookie         │
│  - Clear refreshToken cookie        │
└──────┬──────────────────────────────┘
       │
       │ Response: Logout successful
       ▼
┌─────────────┐
│   Client    │
│  (Browser)  │
│  Cookies    │
│  Cleared    │
└─────────────┘
```

## 5. Multi-Device Session Management

```
┌──────────────────────────────────────────────────┐
│              User's Devices                      │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │ Laptop  │  │  Phone  │  │ Tablet  │         │
│  └────┬────┘  └────┬────┘  └────┬────┘         │
│       │            │            │               │
│       │ Login      │ Login      │ Login         │
│       ▼            ▼            ▼               │
└──────────────────────────────────────────────────┘
        │            │            │
        ▼            ▼            ▼
┌─────────────────────────────────────────────────┐
│            Session Database                     │
├─────────────────────────────────────────────────┤
│  Session 1: user_123, Laptop, token_abc         │
│  Session 2: user_123, Phone, token_def          │
│  Session 3: user_123, Tablet, token_ghi         │
└─────────────────────────────────────────────────┘
        │
        │ User calls /logout-all
        ▼
┌─────────────────────────────────────────────────┐
│  Mark all sessions as inactive                  │
│  - Session 1: is_active = false                 │
│  - Session 2: is_active = false                 │
│  - Session 3: is_active = false                 │
└─────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────┐
│  All devices logged out                         │
│  Must login again on each device                │
└─────────────────────────────────────────────────┘
```

## 6. Role-Based Access Control

```
┌─────────────────────────────────────────────────┐
│              Request Flow                       │
└─────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────┐
│  1. authenticate middleware                     │
│     - Verify access token                       │
│     - Attach user to request                    │
└──────┬──────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────┐
│  2. isAdmin / isPatient middleware              │
│     - Check user_type in token                  │
│     - Allow or deny based on type               │
└──────┬──────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────┐
│  3. hasAdminRole('superadmin') middleware       │
│     - Check role in token                       │
│     - Allow only if role matches                │
└──────┬──────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────┐
│  4. Controller Handler                          │
│     - Execute business logic                    │
│     - Return response                           │
└─────────────────────────────────────────────────┘

Example Route Protection:
┌─────────────────────────────────────────────────┐
│  DELETE /api/admin/:id                          │
│  ├─ authenticate                                │
│  ├─ isAdmin                                     │
│  └─ hasAdminRole('superadmin')                  │
│     └─ Only superadmins can delete admins       │
└─────────────────────────────────────────────────┘
```

## 7. Cookie Security

```
┌─────────────────────────────────────────────────┐
│           Cookie Attributes                     │
├─────────────────────────────────────────────────┤
│                                                 │
│  Access Token Cookie:                           │
│  ┌───────────────────────────────────────────┐ │
│  │ Name: accessToken                         │ │
│  │ Value: eyJhbGciOiJIUzI1NiIs...           │ │
│  │ HttpOnly: true  ← No JavaScript access    │ │
│  │ Secure: true    ← HTTPS only (prod)       │ │
│  │ SameSite: Strict ← CSRF protection        │ │
│  │ Path: /                                   │ │
│  │ MaxAge: 900000 (15 minutes)               │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Refresh Token Cookie:                          │
│  ┌───────────────────────────────────────────┐ │
│  │ Name: refreshToken                        │ │
│  │ Value: eyJhbGciOiJIUzI1NiIs...           │ │
│  │ HttpOnly: true  ← No JavaScript access    │ │
│  │ Secure: true    ← HTTPS only (prod)       │ │
│  │ SameSite: Strict ← CSRF protection        │ │
│  │ Path: /api/auth                           │ │
│  │ MaxAge: 604800000 (7 days)                │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
└─────────────────────────────────────────────────┘

Security Benefits:
✅ HttpOnly → Prevents XSS attacks
✅ Secure → Prevents man-in-the-middle
✅ SameSite → Prevents CSRF attacks
✅ Separate paths → Limits cookie scope
```

## 8. Complete Authentication Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Login    │  │  Dashboard │  │  Settings  │            │
│  │   Page     │  │   (Auth)   │  │   (Auth)   │            │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘            │
└────────┼───────────────┼───────────────┼────────────────────┘
         │               │               │
         │ credentials:  │ credentials:  │ credentials:
         │ 'include'     │ 'include'     │ 'include'
         │               │               │
         ▼               ▼               ▼
┌──────────────────────────────────────────────────────────────┐
│                    Express Server                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Middleware Stack                                      │ │
│  │  1. helmet()        - Security headers                 │ │
│  │  2. cors()          - CORS with credentials            │ │
│  │  3. cookieParser()  - Parse cookies                    │ │
│  │  4. express.json()  - Parse JSON                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Auth Routes                                           │ │
│  │  /api/auth/admin/*   → Admin Auth Controller          │ │
│  │  /api/auth/patient/* → Patient Auth Controller        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Protected Routes                                      │ │
│  │  authenticate → isAdmin → Controller                   │ │
│  │  authenticate → isPatient → Controller                 │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────────────┐
│                    Database Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Admin     │  │   Patient    │  │   Session    │      │
│  │    Table     │  │    Table     │  │    Table     │      │
│  │              │  │              │  │              │      │
│  │ - admin_ID   │  │ - patient_ID │  │ - session_id │      │
│  │ - username   │  │ - username   │  │ - user_id    │      │
│  │ - password   │  │ - password   │  │ - user_type  │      │
│  │ - role       │  │ - email      │  │ - token      │      │
│  │ - email      │  │ - phone      │  │ - is_active  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────────────────────────────────────────────────────────┘
```

---

## Key Takeaways

1. **Stateful**: Sessions stored in database for better control
2. **Secure**: HTTP-only cookies prevent XSS attacks
3. **Flexible**: Multiple middleware options for different scenarios
4. **Scalable**: Support for multiple devices and sessions
5. **Type-Safe**: Clear separation between admin and patient flows
6. **Production-Ready**: Environment-specific security settings

---

For implementation details, see:
- `AUTH_SYSTEM_DOCUMENTATION.md`
- `AUTH_QUICK_START.md`
- `AUTH_IMPLEMENTATION_SUMMARY.md`
