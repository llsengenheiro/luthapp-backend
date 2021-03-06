import * as Yup from 'yup';

import Order from '../models/Order';
import Service from '../models/Service';

class OrderTechnicalAccpetController {
  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    if (!(req.userPerfil === 'tech')) {
      return res.status(401).json({ error: 'Perfil não autorizado' });
    }

    const { id } = req.body;

    const statusNew = 'programada';
    const orderExist = await Order.findByPk(id);

    if (!orderExist) {
      return res.status(401).json({ error: 'Ordem de serviço não existe' });
    }

    if (req.userId !== orderExist.technical_id) {
      return res.status(401).json({ error: 'Está ordem não pertence a você' });
    }

    const aceppt_at = new Date();

    await Order.update({ aceppt_at, status: statusNew }, { where: { id } });
    await Service.update(
      { status: statusNew },
      { where: { id: orderExist.service_id } }
    );

    return res.json({
      status: statusNew,
      aceppt_at,
    });
  }
}
export default new OrderTechnicalAccpetController();
