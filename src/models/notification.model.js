const { DataTypes } = require("sequelize");
const { db } = require("../database");

const Notification = db.define("NOTIFICATION", {
    notification_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    user_ID: {
        type: DataTypes.STRING(10),
        allowNull: false,
        references: {
            model: 'USER',
            key: 'user_ID'
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    },
    user_type: {
        type: DataTypes.ENUM('admin', 'nurse', 'patient'),
        allowNull: false
    },
    type: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    related_entity_type: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    related_entity_ID: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Notification;
