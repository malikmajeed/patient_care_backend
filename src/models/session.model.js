const { DataTypes } = require("sequelize");
const { db } = require("../database");

const Session = db.define("SESSION", {
    session_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.STRING(6),
        allowNull: false
    },
    user_type: {
        type: DataTypes.ENUM("admin", "patient"),
        allowNull: false
    },
    refresh_token: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    ip_address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    user_agent: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    freezeTableName: true,
    indexes: [
        {
            fields: ['user_id', 'user_type']
        },
        {
            fields: ['refresh_token']
        },
        {
            fields: ['expires_at']
        }
    ]
});

module.exports = Session;
