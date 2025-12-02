## Patient Care Backend API

This project is a Node.js/Express + Sequelize backend for a patient–nurse matching platform.  
It exposes CRUD APIs for all core entities in your ERD: patients, nurses, admins, bookings, payments, care requirements, reviews, documents, work schedules, service categories, nurse skills, and required services.

### Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **ORM**: Sequelize (PostgreSQL)
- **Validation**: Joi
- **Security / Middleware**: helmet, cors, morgan

### Getting Started

1. **Install dependencies**

```bash
npm install
```

2. **Configure database**

Update `src/config/database.js` and your `.env` file with PostgreSQL connection details.

3. **Run in development**

```bash
npm run dev
```

The API will start on `http://localhost:3000` by default.

### Base URL

All routes are mounted under:

- **Base path**: `/api`

For example, patient signup is `POST /api/patient/signup`.

### Core Endpoints (Summary)

- **Patient**
  - `POST /api/patient/signup`
  - `POST /api/patient/login`
  - `PATCH /api/patient/update/:id`

- **Admin**
  - `POST /api/admin/signup`
  - `POST /api/admin/login`
  - `PATCH /api/admin/update/:id`

- **Nurse**
  - `POST /api/nurse/signup`
  - `POST /api/nurse/login`
  - `PATCH /api/nurse/update/:id`
  - `GET /api/nurse/` (list)
  - `GET /api/nurse/:id`
  - `DELETE /api/nurse/:id`

- **Booking**
  - `POST /api/booking/`
  - `GET /api/booking/`
  - `GET /api/booking/:id`
  - `PATCH /api/booking/:id`
  - `DELETE /api/booking/:id`

- **Payment**
  - `POST /api/payment/`
  - `GET /api/payment/`
  - `GET /api/payment/:id`
  - `PATCH /api/payment/:id`
  - `DELETE /api/payment/:id`

- **Care Requirement**
  - `POST /api/care-requirement/`
  - `GET /api/care-requirement/`
  - `GET /api/care-requirement/:id`
  - `PATCH /api/care-requirement/:id`
  - `DELETE /api/care-requirement/:id`

- **Review**
  - `POST /api/review/`
  - `GET /api/review/`
  - `GET /api/review/:id`
  - `PATCH /api/review/:id`
  - `DELETE /api/review/:id`

- **Service Category**
  - `POST /api/service-category/`
  - `GET /api/service-category/`
  - `GET /api/service-category/:id`
  - `PATCH /api/service-category/:id`
  - `DELETE /api/service-category/:id`

- **Document**
  - `POST /api/document/`
  - `GET /api/document/`
  - `GET /api/document/:id`
  - `PATCH /api/document/:id`
  - `DELETE /api/document/:id`

- **Work Schedule**
  - `POST /api/work-schedule/`
  - `GET /api/work-schedule/`
  - `GET /api/work-schedule/:id`
  - `PATCH /api/work-schedule/:id`
  - `DELETE /api/work-schedule/:id`

- **Nurse Skill** (composite key: nurse_ID + category_ID)
  - `POST /api/nurse-skill/`
  - `GET /api/nurse-skill/`
  - `GET /api/nurse-skill/:nurseId/:categoryId`
  - `PATCH /api/nurse-skill/:nurseId/:categoryId`
  - `DELETE /api/nurse-skill/:nurseId/:categoryId`

- **Required Service** (composite key: req_ID + category_ID)
  - `POST /api/required-service/`
  - `GET /api/required-service/`
  - `GET /api/required-service/:reqId/:categoryId`
  - `PATCH /api/required-service/:reqId/:categoryId`
  - `DELETE /api/required-service/:reqId/:categoryId`

### Validation & Business Rules

- Each entity is validated with a Joi schema in `src/schema/`.
- IDs such as `patient_ID`, `admin_ID`, `nurse_ID` are generated using helpers in `src/utils/id_genrator.js`.
- Passwords are hashed using `bcrypt` via `src/utils/encrypt_password.js`.

### Health Check

- `GET /api/health` returns basic status and timestamp.


