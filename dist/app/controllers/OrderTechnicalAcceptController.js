"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);

var _Order = require('../models/Order'); var _Order2 = _interopRequireDefault(_Order);
var _Service = require('../models/Service'); var _Service2 = _interopRequireDefault(_Service);

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
    const orderExist = await _Order2.default.findByPk(id);

    if (!orderExist) {
      return res.status(401).json({ error: 'Ordem de serviço não existe' });
    }

    if (req.userId !== orderExist.technical_id) {
      return res.status(401).json({ error: 'Está ordem não pertence a você' });
    }

    const aceppt_at = new Date();

    await _Order2.default.update({ aceppt_at, status: statusNew }, { where: { id } });
    await _Service2.default.update(
      { status: statusNew },
      { where: { id: orderExist.service_id } }
    );

    return res.json({
      status: statusNew,
      aceppt_at,
    });
  }
}
exports. default = new OrderTechnicalAccpetController();
