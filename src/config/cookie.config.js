const dotenv = require("dotenv");
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
// In production, default to cross-origin cookies so frontend (e.g. Railway) can send cookies to the backend.
// Set ALLOW_CROSS_ORIGIN_COOKIES=false to use SameSite=Strict (same-origin only).
const crossOriginCookies = isProduction
    ? process.env.ALLOW_CROSS_ORIGIN_COOKIES !== "false"
    : process.env.ALLOW_CROSS_ORIGIN_COOKIES === "true";
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
