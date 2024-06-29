'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('teachers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      first_name: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      last_name: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      date_of_birth: {
        allowNull: false,
        type: Sequelize.DATE
      },
      street: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      number: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      city: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      phone_number: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('teachers');
  }
};
