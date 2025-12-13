const { verifyAccessToken } = require("../utils/jwt.utils");
const Admin = require("../models/admin.model");
const Patient = require("../models/patient.model");

/**
 * Middleware to authenticate requests using access token from cookies
 */
const authenticate = async (req, res, next) => {
    try {
        // Get access token from cookie
        const accessToken = req.cookies?.accessToken;

        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: "Access token not found. Please login."
            });
        }

        // Verify access token
        const decoded = verifyAccessToken(accessToken);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired access token. Please refresh or login again."
            });
        }

        // Attach user info to request
        req.user = {
            user_id: decoded.user_id,
            username: decoded.username,
            email: decoded.email,
            user_type: decoded.user_type,
            role: decoded.role // Only present for admin users
        };

        next();
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Authentication failed",
            error: error.message
        });
    }
};

/**
 * Middleware to check if user is an admin
 */
const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }

    if (req.user.user_type !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin privileges required."
        });
    }

    next();
};

/**
 * Middleware to check if user is a patient
 */
const isPatient = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }

    if (req.user.user_type !== "patient") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Patient account required."
        });
    }

    next();
};

/**
 * Middleware to check admin role (superadmin, manager, staff)
 */
const hasAdminRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || req.user.user_type !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${allowedRoles.join(" or ")}`
            });
        }

        next();
    };
};

/**
 * Middleware to verify user owns the resource
 * Checks if the user_id in params matches the authenticated user
 */
const isResourceOwner = (req, res, next) => {
    const resourceUserId = req.params.id;

    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }

    // Allow admins to access any resource
    if (req.user.user_type === "admin") {
        return next();
    }

    // Check if user owns the resource
    if (req.user.user_id !== resourceUserId) {
        return res.status(403).json({
            success: false,
            message: "Access denied. You can only access your own resources."
        });
    }

    next();
};

/**
 * Optional authentication - doesn't fail if no token present
 * Useful for routes that work differently for authenticated vs unauthenticated users
 */
const optionalAuth = async (req, res, next) => {
    try {
        const accessToken = req.cookies?.accessToken;

        if (accessToken) {
            const decoded = verifyAccessToken(accessToken);
            if (decoded) {
                req.user = {
                    user_id: decoded.user_id,
                    username: decoded.username,
                    email: decoded.email,
                    user_type: decoded.user_type,
                    role: decoded.role
                };
            }
        }

        next();
    } catch (error) {
        // Don't fail, just continue without user
        next();
    }
};

module.exports = {
    authenticate,
    isAdmin,
    isPatient,
    hasAdminRole,
    isResourceOwner,
    optionalAuth
};