const authService = require("../services/auth.service");
const patientService = require("../services/patient.service");
const adminService = require("../services/admin.service");
const nurseService = require("../services/nurse.service");

/**
 * Handle Signup based on role
 */
const signup = async (req, res) => {
    try {
        const { role } = req.body; // Expect role in body or determine by endpoint?
        // Assuming this controller handles generic signup if we pass role, 
        // OR we can export specific signup functions if needed.
        // For Patient Auth Controller replacement, we stick to Patient Logic or Generic logic?
        // The user asked to "update patient.auth.controller.js to a centralized user.auth.controller.js"
        // I will implement a generic structure where possible, but if the route calls 'signup', it probably expects patient signup
        // UNLESS the route is also updated to be generic. 
        // Let's assume this controller methods will replace specific ones.

        // However, since we are replacing 'patient.auth.controller', let's make it generic 'user.auth.controller'
        // But the previous file had 'signup' which called 'patientService.create'.

        let user;
        // If we want a truly centralized signup, we need to know the target role.
        // If the frontend calls /api/auth/register with a 'role' param, great.
        // But existing patient signup didn't require 'role' in body because it was hit on /patient/signup.

        // I will keep the original logic for patient signup if called via patient route, 
        // OR I can export 'signupPatient', 'signupAdmin', etc within this centralized controller.

        // Let's export specific signups and a generic login.
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}


/**
 * Generic Login
 */
const login = async (req, res) => {
    try {
        // We need to try login against different services or use a unified user service?
        // The services (patientService, adminService) now use User model interally.
        // But 'patientService.login' handles the logic of finding User AND Patient profile.
        // If we want a centralized login, we probably want to find the User first, then fetch the profile.
        // BUT, currently the services do that.
        // So for now, we might need to know "who" is logging in to call the right service 
        // OR we try to find the User, check the role, and then fetch the profile.

        // Let's try to implement a smart login that detects the user type.
        const { email, username, password } = req.body;

        // We can't use Service.login directly without knowing the service.
        // But we can use the User model directly!
        const User = require("../models/user.model");
        const { comparePassword } = require("../utils/encrypt_password.utils");
        const { Op } = require("sequelize");

        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { username: username || '' }, // if username provided
                    { email: email || username || '' } // allow username field to be email
                ]
            }
        });

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await comparePassword(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Now fetch full profile based on role
        let fullProfile;
        if (user.role === 'patient') {
            fullProfile = await patientService.getById(user.user_ID.replace('USR', 'PT')); // Wait, ID logic might differ? 
            // Actually services use `where: { user_ID: user.user_ID }` in getById? 
            // No, getById usually takes the PK of the profile (patient_ID).
            // But we can add a method `getByUserId` to services or just use the relation here.
            const Patient = require("../models/patient.model");
            const patient = await Patient.findOne({ where: { user_ID: user.user_ID } });
            if (patient) fullProfile = { ...patient.toJSON(), ...user.toJSON() }; // merged
        } else if (user.role === 'admin' || user.role === 'superadmin') {
            const Admin = require("../models/admin.model");
            const admin = await Admin.findOne({ where: { user_ID: user.user_ID } });
            if (admin) fullProfile = { ...admin.toJSON(), ...user.toJSON() };
        } else if (user.role === 'nurse') {
            const Nurse = require("../models/nurse.model");
            const nurse = await Nurse.findOne({ where: { user_ID: user.user_ID } });
            if (nurse) fullProfile = { ...nurse.toJSON(), ...user.toJSON() };
        }

        // Clean up sensitive fields
        if (fullProfile) {
            delete fullProfile.password;
            delete fullProfile.password_hash;
            delete fullProfile.USER; // if included
        } else {
            // Fallback if profile missing (shouldn't happen)
            fullProfile = user.toJSON();
            delete fullProfile.password_hash;
        }

        // Handle Session & Cookies
        const result = await authService.handleLogin(fullProfile, user.role, res, req);

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: result.user
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
    signupPatient
};
