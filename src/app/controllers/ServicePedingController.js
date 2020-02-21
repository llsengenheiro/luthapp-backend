import { Op } from 'sequelize';
import Service from '../models/Service';
import Client from '../models/Client';

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
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'name', 'address', 'cellphone'],
        },
      ],
    });

    return res.json(servicePeding);
  }
}
export default new ServicePedingController();
