import { Op } from 'sequelize';
import Service from '../models/Service';
import Client from '../models/Client';
import User from '../models/User';

class ServicePedingController {
  async index(req, res) {
    if (!(req.userPerfil === 'admin')) {
      return res.status(401).json({ error: 'Perfil não autorizado' });
    }

    const servicePeding = await Service.findAll({
      where: {
        status: {
          [Op.or]: ['aberta'],
        },
      },
      attributes: ['id', 'type', 'defect'],
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'name', 'address', 'cellphone'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
        },
      ],
    });

    return res.json(servicePeding);
  }
}
export default new ServicePedingController();
