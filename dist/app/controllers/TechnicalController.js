"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
// import Order from '../models/Order';

class TechnicalController {
  // index -- list technical

  async index(req, res) {
    if (req.userPerfil !== 'admin') {
      return res.status(400).json({ error: 'Perfil não autorizado' });
    }

    const technicals = await _User2.default.findAll({
      where: { perfil: 'tech' },
      attributes: ['id', 'name', 'email'],
    });

    return res.json(technicals);
  }

  // update - set order technical
}

exports. default = new TechnicalController();
