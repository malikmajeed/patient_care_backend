/**
 * Migration: Add years_of_experience, hourly_rate, and total_reviews to NURSE table
 * Created: 2024-12-20
 */

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add years_of_experience column
    await queryInterface.addColumn('NURSE', 'years_of_experience', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null
    });

    // Add hourly_rate column
    await queryInterface.addColumn('NURSE', 'hourly_rate', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: null
    });

    // Add total_reviews column
    await queryInterface.addColumn('NURSE', 'total_reviews', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('NURSE', 'years_of_experience');
    await queryInterface.removeColumn('NURSE', 'hourly_rate');
    await queryInterface.removeColumn('NURSE', 'total_reviews');
  }
};
