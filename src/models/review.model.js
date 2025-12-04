const { DataTypes } = require("sequelize");
const { db } = require("../database");

const Review = db.define("REVIEW", {
    review_ID: {
        type: DataTypes.STRING(6),
        primaryKey: true,
        allowNull: false
    },
    rating_score: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    written_review: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    review_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    patient_ID: {
        type: DataTypes.STRING(6),
        references: {
            model: "PATIENT",
            key: "patient_ID"
        }
    },
    nurse_ID: {
        type: DataTypes.STRING(6),
        references: {
            model: "NURSE",
            key: "nurse_ID"
        }
    },
    booking_ID: {
        type: DataTypes.STRING(6),
        references: {
            model: "BOOKING",
            key: "booking_ID"
        }
    }
});

module.exports = Review;
