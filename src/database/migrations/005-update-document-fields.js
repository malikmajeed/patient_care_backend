/**
 * Migration: Add issuing_authority and issue_date to DOCUMENTS table
 * Created: 2024-12-20
 */

'use strict';

module.exports = {
  async up(queryInterface, { DataTypes, Sequelize }) {
    // Add issuing_authority column
    await queryInterface.addColumn('DOCUMENTS', 'issuing_authority', {
      type: DataTypes.STRING,
      allowNull: true
    });

    // Add issue_date column
    await queryInterface.addColumn('DOCUMENTS', 'issue_date', {
      type: DataTypes.DATE,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('DOCUMENTS', 'issuing_authority');
    await queryInterface.removeColumn('DOCUMENTS', 'issue_date');
  }
};
