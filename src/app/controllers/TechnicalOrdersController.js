import { Op } from 'sequelize';
import Order from '../models/Order';

class TechnicalOrdersController {
  // index -- list order by technical

  async index(req, res) {
    if (req.userPerfil !== 'tech') {
      return res.status(400).json({ error: 'Perfil não autorizado' });
    }

    const techOrders = await Order.findAll({
      where: {
        [Op.and]: [
          {
            status: {
              [Op.or]: ['aberta', 'programada'],
            },
          },
          {
            technical_id: req.userId,
          },
        ],
      },
    });

    return res.json(techOrders);
  }

  // update - set order technical
}

export default new TechnicalOrdersController();
