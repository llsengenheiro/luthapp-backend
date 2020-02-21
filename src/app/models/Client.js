import Sequelize, { Model } from 'sequelize';

class Client extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        address: Sequelize.STRING,
        contract: Sequelize.BOOLEAN,
        cellphone: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    Client.associate = models => {
      Client.belongsToMany(models.User, {
        through: 'users_clients',
        as: 'user',
        foreignKey: 'client_id',
      });
    };
    return this;
  }
}
export default Client;
