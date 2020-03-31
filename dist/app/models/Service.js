"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

class Service extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        type: _sequelize2.default.STRING,
        defect: _sequelize2.default.STRING,
        status: _sequelize2.default.STRING,
        canceled_at: _sequelize2.default.DATE,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client' });
  }
}
exports. default = Service;
