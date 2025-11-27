const { DataTypes } = require("sequelize");
const db = require("../database");

const Admin = db.define("ADMIN", {
    admin_ID: {
        type: DataTypes.STRING(6),
        primaryKey: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM("superadmin", "manager", "staff"),
        allowNull: false
    }
});

module.exports = Admin;
