import * as Yup from 'yup';

import Order from '../models/Order';

class ServiceController {
  async store(req, res) {
    if (!(req.userPerfil === 'admin')) {
      return res.status(401).json({ error: 'Perfil não autorizado' });
    }

    const schema = Yup.object().shape({
      service_id: Yup.number()
        .integer()
        .required(),
      technical_id: Yup.number()
        .integer()
        .required(),
      description_defect: Yup.string().required(),
      status: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Falha na validação' });
    }

    const { technical_id, service_id, description_defect, status } = req.body;

    const order = await Order.create({
      user_id: req.userId,
      technical_id,
      service_id,
      description_defect,

      status,
    });

    return res.json(order);
  }

  async index(req, res) {
    if (!(req.userPerfil === 'admin')) {
      return res.status(401).json({ error: 'Perfil não autorizado' });
    }

    const servicePeding = await Order.findAll();

    return res.json(servicePeding);
  }
}
export default new ServiceController();
