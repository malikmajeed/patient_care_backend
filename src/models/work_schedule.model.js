const { DataTypes } = require("sequelize");
const { db } = require("../database");

const WorkSchedule = db.define("WORK", {
    work_id: {
        type: DataTypes.STRING(6),
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    nurse_ID: {
        type: DataTypes.STRING(6),
        allowNull: false,
        references: {
            model: "NURSE",
            key: "nurse_ID"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    },
    day: {
        type: DataTypes.ENUM(
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday"
        ),
        allowNull: false
    },
    time_range: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = WorkSchedule;
