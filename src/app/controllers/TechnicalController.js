import User from '../models/User';
// import Order from '../models/Order';

class TechnicalController {
  // index -- list technical

  async index(req, res) {
    if (req.userPerfil !== 'admin') {
      return res.status(400).json({ error: 'Perfil não autorizado' });
    }

    const technicals = await User.findAll({
      where: { perfil: 'tech' },
      attributes: ['id', 'name', 'email'],
    });

    return res.json(technicals);
  }

  // update - set order technical
}

export default new TechnicalController();
