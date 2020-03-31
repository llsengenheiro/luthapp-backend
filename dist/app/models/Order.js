"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

class Order extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        description_defect: _sequelize2.default.STRING,
        service_done: _sequelize2.default.STRING,
        status: _sequelize2.default.STRING,
        backlog: _sequelize2.default.STRING,
        canceled_at: _sequelize2.default.DATE,
        aceppt_at: _sequelize2.default.DATE,
        start_at: _sequelize2.default.DATE,
        fineshed_at: _sequelize2.default.DATE,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, {
      foreignKey: 'technical_id',
      as: 'technical',
    });
    this.belongsTo(models.Service, { foreignKey: 'service_id', as: 'service' });
  }
}
exports. default = Order;
