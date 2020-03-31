"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);
var _User = require('../models/User'); var _User2 = _interopRequireDefault(_User);
var _Client = require('../models/Client'); var _Client2 = _interopRequireDefault(_Client);

class UserController {
  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string()
          .email()
          .required(),
        password: Yup.string()
          .required()
          .min(6),
        perfil: Yup.string(),
        onesignal_id: Yup.string(),
        // townhouse: Yup.array(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Falha na validação' });
      }
      const userExist = await _User2.default.findOne({
        where: { email: req.body.email },
      });

      if (userExist) {
        return res.status(400).json({ error: 'Usuário já existe' });
      }

      const { clients, ...data } = req.body;
      console.log(req.body);
      const user = await _User2.default.create(data);

      if (data.perfil === 'client') {
        if (clients && clients.length > 0) {
          user.setClient(clients);
        }
      }

      return res.json({
        user,
      });
    } catch (error) {
      return res.json(error);
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number()
        .integer()
        .required(),
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      onesignal_id: Yup.string(),
      perfil: Yup.string(),
      // townhouse: Yup.array()), Validação do array
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }
    const { id, email, name, perfil, oldPassword } = req.body;

    const user = await _User2.default.findByPk(id);

    if (email && email !== user.email) {
      const userExist = await _User2.default.findOne({
        where: { email },
      });

      if (userExist) {
        return res.status(400).json({ error: 'Usuário já existe' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Senha ou e-mail inválido' });
    }
    const { clients, ...data } = req.body;

    await user.update(data);

    if (perfil === 'client') {
      if (clients && clients.length > 0) {
        user.setClient(clients);
      }
    }

    return res.json({
      id,
      name,
      email,
      perfil,
    });
  }

  async index(req, res) {
    const list = await _User2.default.findAll({
      include: [
        {
          model: _Client2.default,
          as: 'client',
          through: {
            attributes: [],
          },
        },
      ],
    });

    res.json(list);
  }
}

exports. default = new UserController();
