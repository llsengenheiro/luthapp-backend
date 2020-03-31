"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize');
var _Order = require('../models/Order'); var _Order2 = _interopRequireDefault(_Order);
var _Service = require('../models/Service'); var _Service2 = _interopRequireDefault(_Service);
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
var _Client = require('../models/Client'); var _Client2 = _interopRequireDefault(_Client);

class OrderOpenController {
  // index -- list order by technical

  async index(req, res) {
    let orders;
    if (req.userPerfil === 'client') {
      return res.status(400).json({ error: 'Perfil não autorizado' });
    }
    if (req.userPerfil === 'admin') {
      orders = await _Order2.default.findAll({
        where: {
          status: {
            [_sequelize.Op.or]: ['create', 'programada'],
          },
        },
        attributes: ['id', 'description_defect'],
        include: [
          {
            model: _Service2.default,
            as: 'service',
            attributes: ['id', 'type', 'defect', 'status'],
            include: [
              {
                model: _Client2.default,
                as: 'client',
                attributes: ['id', 'name'],
              },
            ],
          },
          {
            model: _User2.default,
            as: 'technical',
            attributes: ['id', 'name'],
          },
        ],
      });
    }
    if (req.userPerfil === 'tech') {
      orders = await _Order2.default.findAll({
        where: {
          [_sequelize.Op.and]: [
            {
              status: {
                [_sequelize.Op.or]: ['create', 'programada'],
              },
            },
            {
              technical_id: req.userId,
            },
          ],
        },
        attributes: ['id', 'description_defect'],
        include: [
          {
            model: _Service2.default,
            as: 'service',
            attributes: ['id', 'type', 'defect', 'status'],
            include: [
              {
                model: _Client2.default,
                as: 'client',
                attributes: ['id', 'name'],
              },
            ],
          },
          {
            model: _User2.default,
            as: 'technical',
            attributes: ['id', 'name'],
          },
        ],
      });
    }

    return res.json(orders);
  }

  // update - set order technical
}

exports. default = new OrderOpenController();
