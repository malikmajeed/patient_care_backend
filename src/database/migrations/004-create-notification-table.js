/**
 * Migration: Create NOTIFICATION table
 * Created: 2024-12-20
 */

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('NOTIFICATION', {
      notification_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_ID: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: {
          model: 'USER',
          key: 'user_ID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_type: {
        type: Sequelize.ENUM('admin', 'nurse', 'patient'),
        allowNull: false
      },
      type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      related_entity_type: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      related_entity_ID: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes for faster lookups
    await queryInterface.addIndex('NOTIFICATION', ['user_ID']);
    await queryInterface.addIndex('NOTIFICATION', ['user_ID', 'is_read']);
    await queryInterface.addIndex('NOTIFICATION', ['related_entity_type', 'related_entity_ID']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('NOTIFICATION');
  }
};
