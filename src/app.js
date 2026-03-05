const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

const app = express();

// Middlewares
app.use(helmet());
// CORS: allow frontend origin(s). Use comma-separated for multiple (e.g. local + production).
const clientOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((u) => u.trim()).filter(Boolean)
  : ['http://localhost:3000'];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || clientOrigins.includes(origin)) return callback(null, true);
    callback(null, false);
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Parse cookies
app.use(morgan('dev'));

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Auth Routes
app.use('/api/auth', require('./routes/user.auth.routes'));
// app.use('/api/auth/patient', require('./routes/patient.auth.routes'));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
    });
});

module.exports = app;
