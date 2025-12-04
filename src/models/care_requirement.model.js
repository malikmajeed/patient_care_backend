const { DataTypes } = require("sequelize");
const { db } = require("../database");

const CareRequirement = db.define("CARE_REQUIREMENT", {
    req_ID: {
        type: DataTypes.STRING(6),
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    symptoms_problems: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    hours_per_day: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date_time_of_service: {
        type: DataTypes.DATE,
        allowNull: false
    },
    patient_ID: {
        type: DataTypes.STRING(6),
        allowNull: false,
        references: {
            model: "PATIENT",
            key: "patient_ID"
        }
    }
});

module.exports = CareRequirement;
