const { DataTypes } = require("sequelize");
const { db } = require("../database");

const Booking = db.define("BOOKING", {
    booking_ID: {
        type: DataTypes.STRING(6),
        primaryKey: true,
        allowNull: false
    },
    booking_status: {
        type: DataTypes.ENUM(
            "pending_nurse_approval",
            "confirmed",
            "in_progress",
            "completed",
            "cancelled_by_patient",
            "cancelled_by_nurse",
            "cancelled_by_admin"
        ),
        allowNull: false,
        defaultValue: "pending_nurse_approval"
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
    start_time: {
        type: DataTypes.TIME,
        allowNull: true
    },
    end_time: {
        type: DataTypes.TIME,
        allowNull: true
    },
    duration_hours: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: true
    },
    service_category_ID: {
        type: DataTypes.STRING(6),
        allowNull: true,
        references: {
            model: "SERVICE_CATEGORY",
            key: "category_ID"
        }
    },
    address_ID: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    special_instructions: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    emergency_contact: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    emergency_reported: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    emergency_reported_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    emergency_details: {
        type: DataTypes.TEXT,
        allowNull: true
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
