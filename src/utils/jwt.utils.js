const jwt = require("jsonwebtoken");
const {
    accessTokenSecret,
    accessTokenExpiry,
    refreshTokenSecret,
    refreshTokenExpiry
} = require("../config/jwt.config");

/**
 * Create payload for JWT token
 * @param {Object} user - User object (Admin or Patient)
 * @param {String} userType - Type of user ('admin' or 'patient')
 * @returns {Object} Token payload
 */
const createTokenPayload = (user, userType) => {
    const basePayload = {
        user_id: user[`${userType}_ID`] || user.user_id,
        username: user.username,
        email: user.email,
        user_type: userType
    };

    // Add role for admin users
    if (userType === "admin" && user.role) {
        basePayload.role = user.role;
    }

    return basePayload;
};

/**
 * Generate Access Token (short-lived)
 * @param {Object} user - User object
 * @param {String} userType - 'admin' or 'patient'
 * @returns {String} JWT access token
 */
const generateAccessToken = (user, userType) => {
    const payload = createTokenPayload(user, userType);
    return jwt.sign(payload, accessTokenSecret, { expiresIn: accessTokenExpiry });
};

/**
 * Generate Refresh Token (long-lived)
 * @param {Object} user - User object
 * @param {String} userType - 'admin' or 'patient'
 * @returns {String} JWT refresh token
 */
const generateRefreshToken = (user, userType) => {
    const payload = createTokenPayload(user, userType);
    return jwt.sign(payload, refreshTokenSecret, { expiresIn: refreshTokenExpiry });
};

/**
 * Verify Access Token
 * @param {String} token - JWT access token
 * @returns {Object|null} Decoded token payload or null if invalid
 */
const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, accessTokenSecret);
    } catch (error) {

        return null;
    }
};

/**
 * Verify Refresh Token
 * @param {String} token - JWT refresh token
 * @returns {Object|null} Decoded token payload or null if invalid
 */
const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, refreshTokenSecret);
    } catch (error) {
        console.error("Refresh token verification failed:", error.message);
        return null;
    }
};

/**
 * Generate both access and refresh tokens
 * @param {Object} user - User object
 * @param {String} userType - 'admin' or 'patient'
 * @returns {Object} Object containing both tokens
 */
const generateTokenPair = (user, userType) => {
    return {
        accessToken: generateAccessToken(user, userType),
        refreshToken: generateRefreshToken(user, userType)
    };
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    generateTokenPair,
    createTokenPayload
};