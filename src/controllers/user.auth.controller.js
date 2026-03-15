const authService = require("../services/auth.service");
const patientService = require("../services/patient.service");
const adminService = require("../services/admin.service");
const nurseService = require("../services/nurse.service");
/**
 * Handle Signup based on role
 */
const signup = async (req, res) => {
    // This function is deprecated in favor of specific signup methods
    // or we can implement a generic one if 'role' is passed.
    res.status(405).json({ message: "Use role-specific signup endpoints" });
};

/**
 * Signup Admin Wrapper
 */
const signupAdmin = async (req, res) => {
    try {
        const admin = await adminService.create(req.body);
        res.status(201).json({
            success: true,
            message: "Admin account created successfully",
            admin
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * Signup Nurse Wrapper
 */
const signupNurse = async (req, res) => {
    try {
        const nurse = await nurseService.create(req.body);
        res.status(201).json({
            success: true,
            message: "Nurse account created successfully",
            nurse
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


const userService = require("../services/user.services");

/**
 * Generic Login
 */
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Delegate business logic to user service
        const { user, role } = await userService.login({ username, password });

        console.log('Login Function');
        // Handle Session & Cookies
        const result = await authService.handleLogin(user, role, res, req);

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: result.user,
            role: role,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
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
 * Generic Logout
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
 * Generic Refresh Token
 */
const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.body?.refreshToken ?? req.cookies?.refreshToken;
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
 * Generic Logout All
 */
const logoutAll = async (req, res) => {
    try {
        const result = await authService.handleLogoutAll(
            req.user.user_id,
            req.user.user_type,
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
 * Generic Get Profile
 */
const getProfile = async (req, res) => {
    try {
        // Logic to get profile based on role in req.user
        const { user_type, user_id } = req.user;
        let profile;

        // Note: user_id in token might be the User ID or Profile ID?
        // auth.service.js:48 -> const userId = user[`${userType}_ID`];
        // So the token contains the Profile ID (e.g. PT0001).

        if (user_type === 'patient') {
            profile = await patientService.getById(user_id);
        } else if (user_type === 'admin') {
            profile = await adminService.getById(user_id);
        } else if (user_type === 'nurse') {
            profile = await nurseService.getById(user_id);
        }

        res.status(200).json({
            success: true,
            user: profile
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
 * Generic Get Sessions
 */
const getSessions = async (req, res) => {
    try {
        const sessions = await authService.getUserSessions(
            req.user.user_id,
            req.user.user_type
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
 * Verify Auth
 */
const verifyAuth = async (req, res) => {
    res.status(200).json({
        success: true,
        authenticated: true,
        user: req.user
    });
};

/**
 * Signup Patient Wrapper
 */
const signupPatient = async (req, res) => {
    try {
        const patient = await patientService.create(req.body);
        res.status(201).json({
            success: true,
            message: "Patient account created successfully",
            patient
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    login,
    logout,
    refreshToken,
    logoutAll,
    getProfile,
    getSessions,
    verifyAuth,
    signupPatient,
    signupAdmin,
    signupNurse
};
