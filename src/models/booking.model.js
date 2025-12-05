const { DataTypes } = require("sequelize");
const { db } = require("../database");

const Booking = db.define("BOOKING", {
    booking_ID: {
        type: DataTypes.STRING(6),
        primaryKey: true,
        allowNull: false
    },
    booking_status: {
        type: DataTypes.ENUM("pending", "confirmed", "completed", "cancelled"),
        allowNull: false
    },
    total_cost: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    payment_status: {
        type: DataTypes.ENUM("unpaid", "paid", "refunded"),
        allowNull: false
    },
    booked_datetime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    invoice_ID: {
        type: DataTypes.STRING,
        allowNull: true
    },
    patient_ID: {
        type: DataTypes.STRING(6),
        allowNull: false,
        references: {
            model: "PATIENT",
            key: "patient_ID"
        }
    },
    nurse_ID: {
        type: DataTypes.STRING(6),
        allowNull: false,
        references: {
            model: "NURSE",
            key: "nurse_ID"
        }
    }
}, {
    freezeTableName: true
});

module.exports = Booking;
