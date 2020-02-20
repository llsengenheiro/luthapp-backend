import Sequelize, { Model } from 'sequelize';

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        description_defect: Sequelize.STRING,
        service_done: Sequelize.STRING,
        status: Sequelize.STRING,
        backlog: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
        aceppt_at: Sequelize.DATE,
        start_at: Sequelize.DATE,
        fineshed_at: Sequelize.DATE,
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
export default Order;
