const { DataTypes } = require("sequelize");
const { db } = require("../database");

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
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    profile_url: {
        type: DataTypes.STRING,
        allowNull: true
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
