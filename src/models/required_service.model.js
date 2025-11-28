const { DataTypes } = require("sequelize");
const db = require("../database");

const RequiredService = db.define("REQUIRED_SERVICE", {
    req_ID: {
        type: DataTypes.STRING(6),
        primaryKey: true,
        references: {
            model: "CARE_REQUIREMENT",
            key: "req_ID"
        }
    },
    category_ID: {
        type: DataTypes.STRING(6),
        primaryKey: true,
        references: {
            model: "SERVICE_CATEGORY",
            key: "category_ID"
        }
    }
});

module.exports = RequiredService;
