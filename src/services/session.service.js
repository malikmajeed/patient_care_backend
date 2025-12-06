const Session = require("../models/session.model");
const { verifyRefreshToken } = require("../utils/jwt.utils");
const { Op } = require("sequelize");

/**
 * Create a new session
 * @param {String} userId - User ID
 * @param {String} userType - 'admin' or 'patient'
 * @param {String} refreshToken - Refresh token
 * @param {Object} requestInfo - Request information (IP, user agent)
 * @returns {Object} Created session
 */
const createSession = async (userId, userType, refreshToken, requestInfo = {}) => {
    try {
        // Calculate expiration date (7 days from now)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const session = await Session.create({
            user_id: userId,
            user_type: userType,
            refresh_token: refreshToken,
            ip_address: requestInfo.ip,
            user_agent: requestInfo.userAgent,
            expires_at: expiresAt,
            is_active: true
        });

        return session;
    } catch (error) {
        throw new Error(`Failed to create session: ${error.message}`);
    }
};

/**
 * Find session by refresh token
 * @param {String} refreshToken - Refresh token
 * @returns {Object|null} Session or null
 */
const findSessionByToken = async (refreshToken) => {
    try {
        const session = await Session.findOne({
            where: {
                refresh_token: refreshToken,
                is_active: true,
                expires_at: {
                    [Op.gt]: new Date()
                }
            }
        });

        return session;
    } catch (error) {
        throw new Error(`Failed to find session: ${error.message}`);
    }
};

/**
 * Invalidate a session (logout)
 * @param {String} refreshToken - Refresh token
 * @returns {Boolean} Success status
 */
const invalidateSession = async (refreshToken) => {
    try {
        const result = await Session.update(
            { is_active: false },
            {
                where: {
                    refresh_token: refreshToken
                }
            }
        );

        return result[0] > 0;
    } catch (error) {
        throw new Error(`Failed to invalidate session: ${error.message}`);
    }
};

/**
 * Invalidate all sessions for a user
 * @param {String} userId - User ID
 * @param {String} userType - 'admin' or 'patient'
 * @returns {Number} Number of sessions invalidated
 */
const invalidateAllUserSessions = async (userId, userType) => {
    try {
        const result = await Session.update(
            { is_active: false },
            {
                where: {
                    user_id: userId,
                    user_type: userType,
                    is_active: true
                }
            }
        );

        return result[0];
    } catch (error) {
        throw new Error(`Failed to invalidate user sessions: ${error.message}`);
    }
};

/**
 * Clean up expired sessions
 * @returns {Number} Number of sessions deleted
 */
const cleanupExpiredSessions = async () => {
    try {
        const result = await Session.destroy({
            where: {
                [Op.or]: [
                    {
                        expires_at: {
                            [Op.lt]: new Date()
                        }
                    },
                    {
                        is_active: false,
                        updatedAt: {
                            [Op.lt]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days old
                        }
                    }
                ]
            }
        });

        return result;
    } catch (error) {
        throw new Error(`Failed to cleanup sessions: ${error.message}`);
    }
};

/**
 * Get all active sessions for a user
 * @param {String} userId - User ID
 * @param {String} userType - 'admin' or 'patient'
 * @returns {Array} Array of active sessions
 */
const getUserActiveSessions = async (userId, userType) => {
    try {
        const sessions = await Session.findAll({
            where: {
                user_id: userId,
                user_type: userType,
                is_active: true,
                expires_at: {
                    [Op.gt]: new Date()
                }
            },
            attributes: ['session_id', 'ip_address', 'user_agent', 'createdAt', 'expires_at'],
            order: [['createdAt', 'DESC']]
        });

        return sessions;
    } catch (error) {
        throw new Error(`Failed to get user sessions: ${error.message}`);
    }
};

/**
 * Validate and verify a refresh token
 * @param {String} refreshToken - Refresh token
 * @returns {Object|null} Session and decoded token or null
 */
const validateRefreshToken = async (refreshToken) => {
    try {
        // Verify JWT token
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            return null;
        }

        // Check if session exists and is active
        const session = await findSessionByToken(refreshToken);
        if (!session) {
            return null;
        }

        return {
            session,
            decoded
        };
    } catch (error) {
        console.error("Refresh token validation error:", error);
        return null;
    }
};

module.exports = {
    createSession,
    findSessionByToken,
    invalidateSession,
    invalidateAllUserSessions,
    cleanupExpiredSessions,
    getUserActiveSessions,
    validateRefreshToken
};
