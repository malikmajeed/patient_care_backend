const { DataTypes } = require("sequelize");
const db = require("../database");

const Document = db.define("DOCUMENTS", {
    Doc_ID: {
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
        }
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM("certification", "diploma", "other"),
        allowNull: false
    }
});

module.exports = Document;
