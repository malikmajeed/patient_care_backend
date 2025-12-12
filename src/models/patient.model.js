const { DataTypes } = require("sequelize");
const { db } = require("../database");
// const { username } = require("../config/database");

const Patient = db.define("PATIENT", {
    patient_ID: {
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
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: true
    }
}, {
    freezeTableName: true
});

module.exports = Patient;
