import { Op } from 'sequelize';
import Order from '../models/Order';
import Service from '../models/Service';
import User from '../models/User';
import Client from '../models/Client';

class OrderOpenController {
  // index -- list order by technical

  async index(req, res) {
    let orders;
    if (req.userPerfil === 'client') {
      return res.status(400).json({ error: 'Perfil não autorizado' });
    }
    if (req.userPerfil === 'admin') {
      orders = await Order.findAll({
        where: {
          status: {
            [Op.or]: ['aberta', 'programada'],
          },
        },
        attributes: ['id', 'description_defect'],
        include: [
          {
            model: Service,
            as: 'service',
            attributes: ['type', 'status'],
            include: [
              {
                model: Client,
                as: 'client',
                attributes: ['id', 'name'],
              },
            ],
          },
          {
            model: User,
            as: 'technical',
            attributes: ['id', 'name'],
          },
        ],
      });
    }
    if (req.userPerfil === 'tech') {
      orders = await Order.findAll({
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
        attributes: ['id', 'description_defect'],
        include: [
          {
            model: Service,
            as: 'service',
            attributes: ['type', 'status'],
            include: [
              {
                model: Client,
                as: 'client',
                attributes: ['id', 'name'],
              },
            ],
          },
          {
            model: User,
            as: 'technical',
            attributes: ['id', 'name'],
          },
        ],
      });
    }

    return res.json(orders);
  }

  // update - set order technical
}

export default new OrderOpenController();
