/**
 * Migration: Add issuing_authority and issue_date to DOCUMENTS table
 * Created: 2024-12-20
 */

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add issuing_authority column
    await queryInterface.addColumn('DOCUMENTS', 'issuing_authority', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ''
    });

    // Add issue_date column
    await queryInterface.addColumn('DOCUMENTS', 'issue_date', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('DOCUMENTS', 'issuing_authority');
    await queryInterface.removeColumn('DOCUMENTS', 'issue_date');
  }
};
