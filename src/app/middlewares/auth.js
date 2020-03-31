import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não enviado' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    const { data } = decoded;
    const [id, perfil, onesignal_id] = data;

    req.userId = id;
    req.userPerfil = perfil;
    req.userOnesignal = onesignal_id;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
