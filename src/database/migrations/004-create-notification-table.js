/**
 * Migration: Create NOTIFICATION table
 * Created: 2024-12-20
 */

'use strict';

module.exports = {
  async up(queryInterface, { DataTypes, Sequelize }) {
    await queryInterface.createTable('NOTIFICATION', {
      notification_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      user_ID: {
        type: DataTypes.STRING(10),
        allowNull: false,
        references: {
          model: 'USER',
          key: 'user_ID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_type: {
        type: DataTypes.ENUM('admin', 'nurse', 'patient'),
        allowNull: false
      },
      type: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      related_entity_type: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      related_entity_ID: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      created_at: {
        type: DataTypes.DATE,
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
