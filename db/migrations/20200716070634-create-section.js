'use strict'; // eslint-disable-line

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    return queryInterface.createTable('sections', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      order: {
        type: Sequelize.DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        allowNull: false,
      },
      project_id: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'projects',
          },
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT',
      },
      created_at: {
        defaultValue: Sequelize.literal('now()'),
        type: Sequelize.DataTypes.DATE,
      },
      updated_at: {
        defaultValue: Sequelize.literal('now()'),
        type: Sequelize.DataTypes.DATE,
      },
    });
  },
  down: async queryInterface => queryInterface.dropTable('sections'),
};
