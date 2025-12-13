const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    // Access Token Configuration
    accessTokenSecret: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || "default_access_secret",
    accessTokenExpiry: "15m",

    // Refresh Token Configuration
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || "default_refresh_secret",
    refreshTokenExpiry: "7d",

    // Legacy support (deprecated)
    jwtSeceret: process.env.JWT_SECRET,
    jwtRefereshSeceret: process.env.JWT_REFRESH_SECRET,
    jwtExpiry: "15m",
    jwtRefreshExpiry: "7d",
};