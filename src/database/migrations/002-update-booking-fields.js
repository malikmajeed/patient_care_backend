/**
 * Migration: Add new fields to BOOKING table
 * Created: 2024-12-20
 */

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Update booking_status ENUM to include new statuses
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_BOOKING_booking_status" 
      ADD VALUE IF NOT EXISTS 'pending_nurse_approval';
    `);
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_BOOKING_booking_status" 
      ADD VALUE IF NOT EXISTS 'in_progress';
    `);
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_BOOKING_booking_status" 
      ADD VALUE IF NOT EXISTS 'cancelled_by_patient';
    `);
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_BOOKING_booking_status" 
      ADD VALUE IF NOT EXISTS 'cancelled_by_nurse';
    `);
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_BOOKING_booking_status" 
      ADD VALUE IF NOT EXISTS 'cancelled_by_admin';
    `);

    // Add start_time column
    await queryInterface.addColumn('BOOKING', 'start_time', {
      type: Sequelize.TIME,
      allowNull: true
    });

    // Add end_time column
    await queryInterface.addColumn('BOOKING', 'end_time', {
      type: Sequelize.TIME,
      allowNull: true
    });

    // Add duration_hours column
    await queryInterface.addColumn('BOOKING', 'duration_hours', {
      type: Sequelize.DECIMAL(4, 2),
      allowNull: true
    });

    // Add service_category_ID column
    await queryInterface.addColumn('BOOKING', 'service_category_ID', {
      type: Sequelize.STRING(6),
      allowNull: true,
      references: {
        model: 'SERVICE_CATEGORY',
        key: 'category_ID'
      }
    });

    // Add address_ID column
    await queryInterface.addColumn('BOOKING', 'address_ID', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'PATIENT_ADDRESS',
        key: 'address_ID'
      }
    });

    // Add special_instructions column
    await queryInterface.addColumn('BOOKING', 'special_instructions', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    // Add emergency_contact column
    await queryInterface.addColumn('BOOKING', 'emergency_contact', {
      type: Sequelize.STRING(20),
      allowNull: true
    });

    // Add emergency_reported column
    await queryInterface.addColumn('BOOKING', 'emergency_reported', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    // Add emergency_reported_at column
    await queryInterface.addColumn('BOOKING', 'emergency_reported_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    // Add emergency_details column
    await queryInterface.addColumn('BOOKING', 'emergency_details', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('BOOKING', 'start_time');
    await queryInterface.removeColumn('BOOKING', 'end_time');
    await queryInterface.removeColumn('BOOKING', 'duration_hours');
    await queryInterface.removeColumn('BOOKING', 'service_category_ID');
    await queryInterface.removeColumn('BOOKING', 'address_ID');
    await queryInterface.removeColumn('BOOKING', 'special_instructions');
    await queryInterface.removeColumn('BOOKING', 'emergency_contact');
    await queryInterface.removeColumn('BOOKING', 'emergency_reported');
    await queryInterface.removeColumn('BOOKING', 'emergency_reported_at');
    await queryInterface.removeColumn('BOOKING', 'emergency_details');
  }
};
