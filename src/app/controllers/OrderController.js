import * as Yup from 'yup';

// import OneSignal from 'onesignal-node';
import Order from '../models/Order';
import Service from '../models/Service';
import OneSignal from '../../config/onesignal';

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

    const message = {
      app_id: 'f5b5d57c-f68c-4802-9e35-b04559addd16',
      contents: { en: 'English Message' },
      included_segments: ['All'],
    };
    //    const newDevice = client.addDevice();
    //  console.log(JSON.stringify(newDevice));

    OneSignal.sendNotification(message);
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

    if (!order.aceppt_at) {
      return res
        .status(400)
        .json({ error: 'Nenhum técnico aceitou está ordem de serviço' });
    }
    if (req.userId !== order.technical_id) {
      return res.status(401).json({ error: 'Está ordem não pertence a você' });
    }
    /**    const fineshed_at = new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
    }); */
    const fineshed_at = new Date();

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

  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .required(),
    });
    const { id } = req.query;
    console.log(`Teste: ${id}`);

    if (!(await schema.isValid(req.query))) {
      return res.status(401).json({ error: 'Falha na validação' });
    }

    if (req.userPerfil === 'client') {
      return res.status(401).json({ error: 'Perfil não autorizado' });
    }

    const statusNew = 'open';
    const orderExist = await Order.findByPk(id);

    if (!orderExist) {
      return res.status(401).json({ error: 'Ordem de serviço não existe' });
    }

    await Order.destroy({ where: { id } });
    await Service.update(
      { status: statusNew },
      { where: { id: orderExist.service_id } }
    );

    return res.json({
      status: statusNew,
    });
  }
}
export default new OrderController();
