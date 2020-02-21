import * as Yup from 'yup';
import User from '../models/User';
import Client from '../models/Client';

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
        // townhouse: Yup.array(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Falha na validação' });
      }
      const userExist = await User.findOne({
        where: { email: req.body.email },
      });

      if (userExist) {
        return res.status(400).json({ error: 'Usuário já existe' });
      }

      const { clients, ...data } = req.body;
      const user = await User.create(data);

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

    const user = await User.findByPk(id);

    if (email && email !== user.email) {
      const userExist = await User.findOne({
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
    const list = await User.findAll({
      include: [
        {
          model: Client,
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

export default new UserController();
