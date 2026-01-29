/**
 * Migration: Add years_of_experience, hourly_rate, and total_reviews to NURSE table
 * Created: 2024-12-20
 */

'use strict';

module.exports = {
  async up(queryInterface, { DataTypes, Sequelize }) {
    const tableDescription = await queryInterface.describeTable('NURSE');

    // Add years_of_experience column if it doesn't exist
    if (!tableDescription.years_of_experience) {
      await queryInterface.addColumn('NURSE', 'years_of_experience', {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
      });
    }

    // Add hourly_rate column if it doesn't exist
    if (!tableDescription.hourly_rate) {
      await queryInterface.addColumn('NURSE', 'hourly_rate', {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null
      });
    }

    // Add total_reviews column if it doesn't exist
    if (!tableDescription.total_reviews) {
      await queryInterface.addColumn('NURSE', 'total_reviews', {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('NURSE', 'years_of_experience');
    await queryInterface.removeColumn('NURSE', 'hourly_rate');
    await queryInterface.removeColumn('NURSE', 'total_reviews');
  }
};
