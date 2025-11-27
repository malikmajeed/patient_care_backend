const { DataTypes } = require("sequelize");
const db = require("../database");

const Nurse = db.define("NURSE", {
    nurse_ID: {
        type: DataTypes.STRING(6),
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gender: {
        type: DataTypes.ENUM("male", "female", "other"),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    verification_status: {
        type: DataTypes.ENUM("pending", "verified", "rejected"),
        allowNull: false,
        defaultValue: "pending"
    },
    experience_level: {
        type: DataTypes.ENUM("beginner", "intermediate", "expert"),
        allowNull: false
    },
    avg_rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    current_availability: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
});

module.exports = Nurse;
