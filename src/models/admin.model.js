const { DataTypes } = require("sequelize");
const { db } = require("../database");

const Admin = db.define("ADMIN", {
    admin_ID: {
        type: DataTypes.STRING(6),
        primaryKey: true,
        allowNull: false
    },
    user_ID: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
        references: {
            model: 'USER',
            key: 'user_ID'
        }
    },
    role: {
        type: DataTypes.ENUM("superadmin", "manager", "staff"),
        allowNull: false
    }
}, {
    freezeTableName: true
});

module.exports = Admin;
