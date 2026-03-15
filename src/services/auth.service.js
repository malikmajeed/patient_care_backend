const { generateTokenPair } = require("../utils/jwt.utils");
const sessionService = require("./session.service");
const cookieConfig = require("../config/cookie.config");

/**
 * Set authentication cookies
 * @param {Object} res - Express response object
 * @param {String} accessToken - Access token
 * @param {String} refreshToken - Refresh token
 */
const setAuthCookies = (res, accessToken, refreshToken) => {
    // Set access token cookie
    res.cookie("accessToken", accessToken, cookieConfig.accessToken);

    // Set refresh token cookie
    res.cookie("refreshToken", refreshToken, cookieConfig.refreshToken);
};

/**
 * Clear authentication cookies
 * @param {Object} res - Express response object
 */
const clearAuthCookies = (res) => {
    const optsAccess = { path: "/" };
    const optsRefresh = { path: "/api/auth" };
    if (cookieConfig.accessToken.sameSite) optsAccess.sameSite = cookieConfig.accessToken.sameSite;
    if (cookieConfig.accessToken.secure) optsAccess.secure = true;
    if (cookieConfig.refreshToken.sameSite) optsRefresh.sameSite = cookieConfig.refreshToken.sameSite;
    if (cookieConfig.refreshToken.secure) optsRefresh.secure = true;
    res.clearCookie("accessToken", optsAccess);
    res.clearCookie("refreshToken", optsRefresh);
};

/**
 * Handle user login - generate tokens and create session
 * @param {Object} user - User object
 * @param {String} userType - 'admin' or 'patient'
 * @param {Object} res - Express response object
 * @param {Object} req - Express request object
 * @returns {Object} User data and tokens
 */
const handleLogin = async (user, userType, res, req) => {
    try {

        const { accessToken, refreshToken } = generateTokenPair(user, userType);


        // Get request info
        const requestInfo = {
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get("user-agent")
        };

        // Create session
        const userId = user[`${userType}_ID`];
        await sessionService.createSession(userId, userType, refreshToken, requestInfo);

        // Set cookies
        setAuthCookies(res, accessToken, refreshToken);

        // Return user data (exclude sensitive info)
        const userData = { ...user };
        delete userData.password;
        delete userData.password_hash;

        return {
            user: userData,
            accessToken,
            refreshToken, // So frontend can store it for refresh when cross-origin cookies are blocked
            message: "Login successful"
        };
    } catch (error) {
        throw new Error(`Login handler failed: ${error.message}`);
    }
};

/**
 * Handle user logout - invalidate session and clear cookies
 * @param {String} refreshToken - Refresh token
 * @param {Object} res - Express response object
 * @returns {Object} Success message
 */
const handleLogout = async (refreshToken, res) => {
    try {
        if (refreshToken) {
            await sessionService.invalidateSession(refreshToken);
        }

        clearAuthCookies(res);

        return {
            message: "Logout successful"
        };
    } catch (error) {
        throw new Error(`Logout handler failed: ${error.message}`);
    }
};

/**
 * Handle token refresh - validate refresh token and issue new access token
 * @param {String} refreshToken - Refresh token
 * @param {Object} res - Express response object
 * @returns {Object} New access token
 */
const handleRefreshToken = async (refreshToken, res) => {
    try {
        if (!refreshToken) {
            throw new Error("Refresh token not provided");
        }

        // Validate refresh token and get session
        const validation = await sessionService.validateRefreshToken(refreshToken);

        if (!validation) {
            throw new Error("Invalid or expired refresh token");
        }

        const { decoded } = validation;

        // Generate new access token
        const { generateAccessToken } = require("../utils/jwt.utils");
        const newAccessToken = generateAccessToken(
            {
                user_id: decoded.user_id,
                username: decoded.username,
                email: decoded.email,
                role: decoded.role
            },
            decoded.user_type
        );

        // Update access token cookie
        res.cookie("accessToken", newAccessToken, cookieConfig.accessToken);

        return {
            accessToken: newAccessToken,
            message: "Token refreshed successfully"
        };
    } catch (error) {
        throw new Error(`Token refresh failed: ${error.message}`);
    }
};

/**
 * Handle logout from all devices - invalidate all user sessions
 * @param {String} userId - User ID
 * @param {String} userType - 'admin' or 'patient'
 * @param {Object} res - Express response object
 * @returns {Object} Success message
 */
const handleLogoutAll = async (userId, userType, res) => {
    try {
        const count = await sessionService.invalidateAllUserSessions(userId, userType);

        clearAuthCookies(res);

        return {
            message: `Logged out from ${count} device(s) successfully`
        };
    } catch (error) {
        throw new Error(`Logout all failed: ${error.message}`);
    }
};

/**
 * Get user's active sessions
 * @param {String} userId - User ID
 * @param {String} userType - 'admin' or 'patient'
 * @returns {Array} Active sessions
 */
const getUserSessions = async (userId, userType) => {
    try {
        return await sessionService.getUserActiveSessions(userId, userType);
    } catch (error) {
        throw new Error(`Failed to get user sessions: ${error.message}`);
    }
};

module.exports = {
    setAuthCookies,
    clearAuthCookies,
    handleLogin,
    handleLogout,
    handleRefreshToken,
    handleLogoutAll,
    getUserSessions
};
