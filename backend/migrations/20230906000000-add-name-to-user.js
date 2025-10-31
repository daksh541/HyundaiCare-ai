'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add 'name' column to 'Users' table
    return queryInterface.addColumn('Users', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ''
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove 'name' column from 'Users' table
    return queryInterface.removeColumn('Users', 'name');
  }
};
