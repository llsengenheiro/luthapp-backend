"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);

// import OneSignal from 'onesignal-node';
var _Order = require('../models/Order'); var _Order2 = _interopRequireDefault(_Order);
var _Service = require('../models/Service'); var _Service2 = _interopRequireDefault(_Service);
var _onesignal = require('../../config/onesignal'); var _onesignal2 = _interopRequireDefault(_onesignal);

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

    const orderExist = await _Order2.default.findOne({
      where: { service_id },
    });

    if (orderExist) {
      return res.status(401).json({ error: 'Ordem de serviço já foi aberta' });
    }

    const order = await _Order2.default.create({
      user_id: req.userId,
      technical_id,
      service_id,
      description_defect,

      status: 'create',
    });
    if (order) {
      await _Service2.default.update({ status: 'create' }, { where: { id: service_id } });
    }

    const message = {
      app_id: 'f5b5d57c-f68c-4802-9e35-b04559addd16',
      contents: { en: 'English Message' },
      // include_player_ids: [req.userOnesignal],
      include_external_user_ids: [technical_id],
    };

    _onesignal2.default.sendNotification(message);
    return res.json(order);
  }

  async index(req, res) {
    if (!(req.userPerfil === 'admin')) {
      return res.status(401).json({ error: 'Perfil não autorizado' });
    }

    const servicePeding = await _Order2.default.findAll();

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
    const order = await _Order2.default.findByPk(id);

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

    await _Service2.default.update(
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
    const orderExist = await _Order2.default.findByPk(id);

    if (!orderExist) {
      return res.status(401).json({ error: 'Ordem de serviço não existe' });
    }

    await _Order2.default.destroy({ where: { id } });
    await _Service2.default.update(
      { status: statusNew },
      { where: { id: orderExist.service_id } }
    );

    return res.json({
      status: statusNew,
    });
  }
}
exports. default = new OrderController();
