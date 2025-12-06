const patientService = require("../services/patient.service");
const authService = require("../services/auth.service");

/**
 * Patient Signup
 */
const signup = async (req, res) => {
    try {
        const patient = await patientService.create(req.body);

        res.status(201).json({
            success: true,
            message: "Patient account created successfully",
            patient: {
                patient_ID: patient.patient_ID,
                username: patient.username,
                email: patient.email,
                first_name: patient.first_name,
                last_name: patient.last_name,
                phone_number: patient.phone_number
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Patient signup failed",
            error: error.message
        });
    }
};

/**
 * Patient Login
 */
const login = async (req, res) => {
    try {
        const patient = await patientService.login(req.body);
        const result = await authService.handleLogin(patient, "patient", res, req);

        res.status(200).json({
            success: true,
            message: result.message,
            patient: result.user
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Login failed",
            error: error.message
        });
    }
};

/**
 * Patient Logout
 */
const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        const result = await authService.handleLogout(refreshToken, res);

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Logout failed",
            error: error.message
        });
    }
};

/**
 * Refresh Access Token
 */
const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        const result = await authService.handleRefreshToken(refreshToken, res);

        res.status(200).json({
            success: true,
            message: result.message,
            accessToken: result.accessToken
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Token refresh failed",
            error: error.message
        });
    }
};

/**
 * Logout from all devices
 */
const logoutAll = async (req, res) => {
    try {
        const result = await authService.handleLogoutAll(
            req.user.user_id,
            "patient",
            res
        );

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Logout all failed",
            error: error.message
        });
    }
};

/**
 * Get current patient profile
 */
const getProfile = async (req, res) => {
    try {
        const patient = await patientService.getById(req.user.user_id);

        res.status(200).json({
            success: true,
            patient
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get profile",
            error: error.message
        });
    }
};

/**
 * Get active sessions
 */
const getSessions = async (req, res) => {
    try {
        const sessions = await authService.getUserSessions(
            req.user.user_id,
            "patient"
        );

        res.status(200).json({
            success: true,
            sessions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get sessions",
            error: error.message
        });
    }
};

/**
 * Verify authentication status
 */
const verifyAuth = async (req, res) => {
    res.status(200).json({
        success: true,
        authenticated: true,
        user: req.user
    });
};

module.exports = {
    signup,
    login,
    logout,
    refreshToken,
    logoutAll,
    getProfile,
    getSessions,
    verifyAuth
};
