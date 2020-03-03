import { Op } from 'sequelize';
import Order from '../models/Order';

class OrderOpenController {
  // index -- list order by technical

  async index(req, res) {
    if (req.userPerfil !== 'admin') {
      return res.status(400).json({ error: 'Perfil não autorizado' });
    }

    const orders = await Order.findAll({
      where: {
        status: {
          [Op.or]: ['aberta', 'programada'],
        },
      },
    });

    return res.json(orders);
  }

  // update - set order technical
}

export default new OrderOpenController();
