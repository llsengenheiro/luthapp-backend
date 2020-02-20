import jwt from 'jsonwebtoken';

import * as Yup from 'yup';
import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não existe' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Senha não confere!!!' });
    }

    const { id, name, perfil, townhouse } = user;

    return res.json({
      user: {
        id,
        name,
        perfil,
        townhouse,
      },
      token: jwt.sign({ data: [id, perfil] }, authConfig.secret, {
        expiresIn: authConfig.experesIn,
      }), // lutheficienciatecnologica
    });
  }
}

export default new SessionController();
