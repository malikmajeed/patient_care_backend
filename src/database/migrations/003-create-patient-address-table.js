/**
 * Migration: Create PATIENT_ADDRESS table
 * Created: 2024-12-20
 */

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PATIENT_ADDRESS', {
      address_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      patient_ID: {
        type: Sequelize.STRING(6),
        allowNull: false,
        references: {
          model: 'PATIENT',
          key: 'patient_ID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      label: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      house_number: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      street_address: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      area: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      landmark: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      postal_code: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      contact_person: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      contact_phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add index on patient_ID for faster lookups
    await queryInterface.addIndex('PATIENT_ADDRESS', ['patient_ID']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PATIENT_ADDRESS');
  }
};
