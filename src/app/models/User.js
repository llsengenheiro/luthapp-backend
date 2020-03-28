import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        perfil: Sequelize.STRING,
        townhouse: Sequelize.STRING,
        onesignal_id: Sequelize.STRING,
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
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}
export default User;
