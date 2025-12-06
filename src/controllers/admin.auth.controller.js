const adminService = require("../services/admin.service");
const authService = require("../services/auth.service");

/**
 * Admin Signup
 */
const signup = async (req, res) => {
    try {
        const admin = await adminService.create(req.body);

        res.status(201).json({
            success: true,
            message: "Admin account created successfully",
            admin: {
                admin_ID: admin.admin_ID,
                username: admin.username,
                email: admin.email,
                first_name: admin.first_name,
                last_name: admin.last_name,
                role: admin.role
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Admin signup failed",
            error: error.message
        });
    }
};

/**
 * Admin Login
 */
const login = async (req, res) => {
    try {
        const admin = await adminService.login(req.body);
        const result = await authService.handleLogin(admin, "admin", res, req);

        res.status(200).json({
            success: true,
            message: result.message,
            admin: result.user
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
 * Admin Logout
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
            "admin",
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
 * Get current admin profile
 */
const getProfile = async (req, res) => {
    try {
        const admin = await adminService.getById(req.user.user_id);

        res.status(200).json({
            success: true,
            admin
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
            "admin"
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
