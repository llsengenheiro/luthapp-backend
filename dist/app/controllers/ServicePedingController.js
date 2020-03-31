"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize');
var _Service = require('../models/Service'); var _Service2 = _interopRequireDefault(_Service);
var _Client = require('../models/Client'); var _Client2 = _interopRequireDefault(_Client);
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);

class ServicePedingController {
  async index(req, res) {
    if (!(req.userPerfil === 'admin')) {
      return res.status(401).json({ error: 'Perfil não autorizado' });
    }

    const servicePeding = await _Service2.default.findAll({
      where: {
        status: {
          [_sequelize.Op.or]: ['open'],
        },
      },
      attributes: ['id', 'type', 'defect'],
      include: [
        {
          model: _Client2.default,
          as: 'client',
          attributes: ['id', 'name', 'address', 'cellphone'],
        },
        {
          model: _User2.default,
          as: 'user',
          attributes: ['id', 'name'],
        },
      ],
    });

    return res.json(servicePeding);
  }
}
exports. default = new ServicePedingController();
