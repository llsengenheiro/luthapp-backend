"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _bcryptjs = require('bcryptjs'); var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

class User extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        name: _sequelize2.default.STRING,
        email: _sequelize2.default.STRING,
        password: _sequelize2.default.VIRTUAL,
        password_hash: _sequelize2.default.STRING,
        perfil: _sequelize2.default.STRING,
        townhouse: _sequelize2.default.STRING,
        onesignal_id: _sequelize2.default.STRING,
      },
      {
        sequelize,
      }
    );
    User.associate = models => {
      User.belongsToMany(models.Client, {
        through: 'users_clients',
        as: 'client',
        foreignKey: 'user_id',
      });
      this.hasOne(models.Order, {
        foreignKey: 'technical_id',
        as: 'technical',
      });
    };

    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await _bcryptjs2.default.hash(user.password, 8);
      }
    });
    return this;
  }

  checkPassword(password) {
    return _bcryptjs2.default.compare(password, this.password_hash);
  }
}
exports. default = User;
