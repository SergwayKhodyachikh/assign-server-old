'use strict'; // eslint-disable-line

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    return queryInterface.createTable('projects', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      accessibility: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      owner: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT',
      },
      created_at: {
        defaultValue: Sequelize.literal('now()'),
        type: Sequelize.DATE,
      },
      updated_at: {
        defaultValue: Sequelize.literal('now()'),
        type: Sequelize.DATE,
      },
    });
  },
  down: async queryInterface => queryInterface.dropTable('projects'),
};
