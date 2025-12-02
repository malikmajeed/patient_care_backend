const { DataTypes } = require("sequelize");
const db = require("../database");

const Document = db.define("DOCUMENTS", {
    doc_ID: {
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
    attachment_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    issuing_authority: {
        type: DataTypes.STRING,
        allowNull: false
    },
    issue_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    document_type: {
        type: DataTypes.ENUM("certification", "diploma", "other"),
        allowNull: false
    }
});

module.exports = Document;
