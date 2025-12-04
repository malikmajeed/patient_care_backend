const { DataTypes } = require("sequelize");
const { db } = require("../database");

const Payment = db.define("PAYMENT", {
    payment_ID: {
        type: DataTypes.STRING(6),
        primaryKey: true,
        allowNull: false
    },
    transaction_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    payment_method: {
        type: DataTypes.ENUM("card", "cash", "bank_transfer", "wallet"),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("pending", "successful", "failed"),
        allowNull: false
    },
    transaction_details: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    booking_ID: {
        type: DataTypes.STRING(6),
        allowNull: false,
        references: {
            model: "BOOKING",
            key: "booking_ID"
        }
    }
});

module.exports = Payment;
