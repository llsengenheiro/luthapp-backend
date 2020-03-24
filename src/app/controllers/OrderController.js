import * as Yup from 'yup';

import Order from '../models/Order';
import Service from '../models/Service';

class OrderController {
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
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Falha na validação' });
    }

    const { technical_id, service_id, description_defect } = req.body;

    const orderExist = await Order.findOne({
      where: { service_id },
    });

    if (orderExist) {
      return res.status(401).json({ error: 'Ordem de serviço já foi aberta' });
    }

    const order = await Order.create({
      user_id: req.userId,
      technical_id,
      service_id,
      description_defect,

      status: 'create',
    });
    if (order) {
      await Service.update({ status: 'create' }, { where: { id: service_id } });
    }
    return res.json(order);
  }

  async index(req, res) {
    if (!(req.userPerfil === 'admin')) {
      return res.status(401).json({ error: 'Perfil não autorizado' });
    }

    const servicePeding = await Order.findAll();

    return res.json(servicePeding);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .required(),
      service_id: Yup.number()
        .integer()
        .required(),
      technical_id: Yup.number()
        .integer()
        .required(),
      description_defect: Yup.string().required(),
      start_at: Yup.date(),
      fineshed_at: Yup.date(),
      service_done: Yup.string().required(),
      backlog: Yup.string(),
    });

    if (!(req.userPerfil === 'tech')) {
      return res.status(401).json({ error: 'Perfil não autorizado' });
    }
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Falha na validação' });
    }

    const { id } = req.body;

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(400).json({ error: 'Ordem de serviço não existe' });
    }

    const { start_at, fineshed_at, service_done } = await order.update(
      req.body
    );

    return res.json({
      id,
      start_at,
      fineshed_at,
      service_done,
    });
  }
}
export default new OrderController();
