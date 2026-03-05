const dotenv = require("dotenv");
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
// When frontend and backend are on different origins (e.g. Railway), set this so cookies are sent cross-origin.
const crossOriginCookies = process.env.ALLOW_CROSS_ORIGIN_COOKIES === "true";
const sameSiteValue = isProduction && crossOriginCookies ? "none" : isProduction ? "strict" : "lax";
const secureCookies = isProduction || crossOriginCookies;

const cookieConfig = {
    accessToken: {
        httpOnly: true,
        secure: secureCookies,
        sameSite: sameSiteValue,
        maxAge: 15 * 60 * 1000, // 15 minutes
        path: "/",
    },
    refreshToken: {
        httpOnly: true,
        secure: secureCookies,
        sameSite: sameSiteValue,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/api/auth",
    },
};

module.exports = cookieConfig;
