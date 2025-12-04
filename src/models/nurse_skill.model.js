const { DataTypes } = require("sequelize");
const { db } = require("../database");

const NurseSkill = db.define("NURSE_SKILL", {
    nurse_ID: {
        type: DataTypes.STRING(6),
        primaryKey: true,
        references: {
            model: "NURSE",
            key: "nurse_ID"
        }
    },
    category_ID: {
        type: DataTypes.STRING(6),
        primaryKey: true,
        references: {
            model: "SERVICE_CATEGORY",
            key: "category_ID"
        }
    }
});

module.exports = NurseSkill;
