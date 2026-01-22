/**
 * Migration Runner
 * Runs all migrations in order or undoes them
 */

require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');

const DataBaseConfig = require('../../config/database');

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

const migrationsDir = __dirname;
const migrationsTable = 'SequelizeMeta';

async function ensureMigrationsTable() {
    const [results] = await db.query(`
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = '${migrationsTable}'
        );
    `);
    
    if (!results[0].exists) {
        await db.query(`
            CREATE TABLE "${migrationsTable}" (
                name VARCHAR(255) NOT NULL PRIMARY KEY
            );
        `);
        console.log('✓ Created migrations table');
    }
}

async function getCompletedMigrations() {
    const [results] = await db.query(`SELECT name FROM "${migrationsTable}" ORDER BY name`);
    return results.map(row => row.name);
}

async function recordMigration(name, direction) {
    if (direction === 'up') {
        await db.query(`INSERT INTO "${migrationsTable}" (name) VALUES ('${name}')`);
    } else {
        await db.query(`DELETE FROM "${migrationsTable}" WHERE name = '${name}'`);
    }
}

async function runMigrations(undo = false) {
    try {
        await db.authenticate();
        console.log('✓ Database connection established');

        await ensureMigrationsTable();

        const files = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.js') && file !== 'run-migrations.js')
            .sort();

        const completedMigrations = await getCompletedMigrations();

        if (undo) {
            // Run migrations in reverse order
            const completed = files.filter(f => completedMigrations.includes(f));
            for (const file of completed.reverse()) {
                console.log(`\nUndoing migration: ${file}`);
                const migration = require(path.join(migrationsDir, file));
                if (migration.down) {
                    await migration.down(db.getQueryInterface(), { DataTypes, Sequelize });
                    await recordMigration(file, 'down');
                    console.log(`✓ Undone: ${file}`);
                } else {
                    console.log(`⚠ No down migration for: ${file}`);
                }
            }
        } else {
            // Run pending migrations
            const pending = files.filter(f => !completedMigrations.includes(f));
            
            if (pending.length === 0) {
                console.log('✓ No pending migrations');
                return;
            }

            console.log(`\nFound ${pending.length} pending migration(s)`);

            for (const file of pending) {
                console.log(`\nRunning migration: ${file}`);
                const migration = require(path.join(migrationsDir, file));
                if (migration.up) {
                    await migration.up(db.getQueryInterface(), { DataTypes, Sequelize });
                    await recordMigration(file, 'up');
                    console.log(`✓ Completed: ${file}`);
                } else {
                    console.log(`⚠ No up migration for: ${file}`);
                }
            }
        }

        console.log('\n✅ Migrations completed successfully');
        await db.close();
    } catch (error) {
        console.error('❌ Migration error:', error);
        await db.close();
        process.exit(1);
    }
}

// Check command line arguments
const undo = process.argv.includes('--undo');

runMigrations(undo);
