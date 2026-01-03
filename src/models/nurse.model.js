const { DataTypes } = require("sequelize");
const { db } = require("../database");

const Nurse = db.define("NURSE", {
    nurse_ID: {
        type: DataTypes.STRING(6),
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    user_ID: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
        references: {
            model: 'USER',
            key: 'user_ID'
        }
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
    },
    years_of_experience: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    hourly_rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    }
}, {
    freezeTableName: true
});

module.exports = Nurse;
