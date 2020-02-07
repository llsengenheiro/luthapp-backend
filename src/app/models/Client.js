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
    return this;
  }
}
export default Client;
