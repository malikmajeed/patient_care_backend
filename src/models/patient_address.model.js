const { DataTypes } = require("sequelize");
const { db } = require("../database");

const PatientAddress = db.define("PATIENT_ADDRESS", {
    address_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    patient_ID: {
        type: DataTypes.STRING(6),
        allowNull: false,
        references: {
            model: "PATIENT",
            key: "patient_ID"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    },
    label: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    house_number: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    street_address: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    area: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    landmark: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    postal_code: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    contact_person: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    contact_phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    is_default: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    freezeTableName: true
});

module.exports = PatientAddress;
