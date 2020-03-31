"use strict";module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('orders', 'service_done', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('orders', 'service_done', {
      type: Sequelize.STRING,
    });
  },
};
