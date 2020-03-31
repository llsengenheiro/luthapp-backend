"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);
var _sequelize = require('sequelize');
var _Client = require('../models/Client'); var _Client2 = _interopRequireDefault(_Client);

class ClientController {
  async store(req, res) {
    if (!(req.userPerfil === 'admin')) {
      return res.status(401).json({ error: 'Perfil não autorizado' });
    }
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      address: Yup.string().required(),
      cellphone: Yup.string(),
      contract: Yup.boolean().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Falha na validação' });
    }
    const { id, name, address, contract, cellphone } = await _Client2.default.create(
      req.body
    );

    return res.json({ id, name, address, contract, cellphone });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      address: Yup.string(),
      cellphone: Yup.string(),
      contract: Yup.boolean(),
    });

    if (!(req.userPerfil === 'admin')) {
      return res.status(401).json({ error: 'Perfil não autorizado' });
    }
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Falha na validação' });
    }

    const { id, name } = req.body;

    const client = await _Client2.default.findByPk(id);

    if (name && name !== client.name) {
      const clientExist = await _Client2.default.findOne({
        where: { name },
      });

      if (clientExist) {
        return res.status(400).json({ error: 'Cliente já existe' });
      }
    }

    const { address, cellphone, contract } = await client.update(req.body);

    return res.json({
      id,
      name,
      address,
      cellphone,
      contract,
    });
  }

  async delete(req, res) {
    return res.json({ msg: 'delete Client' });
  }

  async show(req, res) {
    return res.json({ msg: 'one Client' });
  }

  async index(req, res) {
    if (!(req.userPerfil === 'admin')) {
      return res.status(401).json({ error: 'Perfil não autorizado' });
    }
    const { client } = req.query;

    const search = `%${client}%`;

    const clients = await _Client2.default.findAll({
      where: {
        name: {
          [_sequelize.Op.iLike]: search,
        },
      },
    });
    return res.json(clients);
  }
}

exports. default = new ClientController();
