"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

class Client extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        name: _sequelize2.default.STRING,
        address: _sequelize2.default.STRING,
        contract: _sequelize2.default.BOOLEAN,
        cellphone: _sequelize2.default.STRING,
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
exports. default = Client;
