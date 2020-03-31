"use strict";module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn(
          'clients',
          'cellphone',
          {
            type: Sequelize.STRING,

            defaultValue: '0000-0000',
          },
          { transaction: t }
        ),
      ]);
    });
  },

  down: queryInterface => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('clients', 'cellphone', { transaction: t }),
      ]);
    });
  },
};
