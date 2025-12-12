const DataBaseConfig = require("../config/database");
require('dotenv').config();
const { Sequelize } = require("sequelize");

const db = new Sequelize(
    DataBaseConfig.database,
    DataBaseConfig.username,
    DataBaseConfig.password,
    {
        host: DataBaseConfig.host,
        port: DataBaseConfig.port,
        dialect: DataBaseConfig.dialect,
        logging: false
    }
);


const connectDB = async () => {
    try {
        await db.authenticate();
        console.log("Database connection has been established successfully.");

        // Import all models to ensure they are registered before sync
        require('../models');

        // if (config.server.environment === 'development' && config.database.autoSyncDb === "true") {
        // WARNING: force: true will drop tables. Required for major refactor involving new Non-Null FKs.
        await db.sync({ force: true });
        console.log('Database models synchronized.');
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
}
// call above function to check connection.
// connectDB();

module.exports = { db, connectDB };

