'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GroupDetails', {
      groupId: { // renamed PK to match naming convention
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      groupName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      members: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      groupIcon: {
        type: Sequelize.STRING,
        allowNull: true
      },
      admin: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('GroupDetails');
  }
};
