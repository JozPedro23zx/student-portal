'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('enrollments', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      student_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      class_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      enrollment_date: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DATE
      },
      status: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(225)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
