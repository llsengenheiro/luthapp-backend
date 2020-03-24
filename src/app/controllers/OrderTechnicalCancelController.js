import * as Yup from 'yup';

import Order from '../models/Order';
import Service from '../models/Service';

class OrderTechnicalCancelController {
  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .required(),
      service_id: Yup.number()
        .integer()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    if (req.userPerfil === 'client') {
      return res.status(401).json({ error: 'Perfil não autorizado' });
    }

    const { id, aceppt_at, service_id } = req.body;

    const statusNew = 'create';
    const orderExist = await Order.findByPk(id);

    if (!orderExist) {
      return res.status(401).json({ error: 'Ordem de serviço não existe' });
    }

    await Order.update({ aceppt_at, status: statusNew }, { where: { id } });
    await Service.update({ status: statusNew }, { where: { id: service_id } });

    return res.json({
      status: statusNew,
    });
  }
}
export default new OrderTechnicalCancelController();
