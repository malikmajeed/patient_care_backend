const User = require("../models/user.model");
const Patient = require("../models/patient.model");
const Admin = require("../models/admin.model");
const Nurse = require("../models/nurse.model");
const { Op } = require("sequelize");
const { comparePassword } = require("../utils/encrypt_password.utils");

/**
 * Generic User Login
 * authenticated against User table and fetches role-specific profile
 * @param {Object} credentials - { username, password }
 * @returns {Object} - Merged full profile
 */
const login = async ({ username, password }) => {
    try {
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { username: username || '' }, // if username provided
                    { email: username || '' } // allow username field to be email
                ]
            }
        });

        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isMatch = await comparePassword(password, user.password_hash);
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        // Now fetch full profile based on role
        let fullProfile;
        if (user.role === 'patient') {
            const patient = await Patient.findOne({ where: { user_ID: user.user_ID } });
            if (patient) fullProfile = { ...patient.toJSON(), ...user.toJSON() };
        } else if (user.role === 'admin' || user.role === 'superadmin') {
            const admin = await Admin.findOne({ where: { user_ID: user.user_ID } });
            // Admin role logic might verify exact sub-role if needed, but generic login allows access
            if (admin) fullProfile = { ...admin.toJSON(), ...user.toJSON() };
        } else if (user.role === 'nurse') {
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

        return { user: fullProfile, role: user.role };

    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    login
};
