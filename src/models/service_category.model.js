const { DataTypes } = require("sequelize");
const { db } = require("../database");

const ServiceCategory = db.define("SERVICE_CATEGORY", {
    category_ID: {
        type: DataTypes.STRING(6),
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = ServiceCategory;
