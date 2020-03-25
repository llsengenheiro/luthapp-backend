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

      service_done: Yup.string().required(),
      backlog: Yup.string(),
    });

    if (!(req.userPerfil === 'tech')) {
      return res.status(401).json({ error: 'Perfil não autorizado' });
    }
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Falha na validação' });
    }

    const { id, service_done, backlog } = req.body;
    const statusNew = 'fineshed';
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(400).json({ error: 'Ordem de serviço não existe' });
    }
    if (req.userId !== order.technical_id) {
      return res.status(401).json({ error: 'Está ordem não pertence a você' });
    }
    // cath date and hour of the moment
    const fineshed_at = '2020-03-25T20:30';

    await order.update({
      fineshed_at,
      service_done,
      backlog,
      status: statusNew,
    });

    await Service.update(
      { status: statusNew },
      { where: { id: order.service_id } }
    );

    return res.json({
      id,
      start_at: order.start_at,
      fineshed_at,
      service_done,
      backlog,
    });
  }
}
export default new OrderController();
