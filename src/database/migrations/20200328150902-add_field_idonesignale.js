module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn(
          'users',
          'onesignal_id',
          {
            type: Sequelize.STRING,
          },
          { transaction: t }
        ),
      ]);
    });
  },

  down: queryInterface => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('users', 'onesignal_id', {
          transaction: t,
        }),
      ]);
    });
  },
};
