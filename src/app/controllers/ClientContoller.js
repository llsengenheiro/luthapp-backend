import * as Yup from 'yup';
import { Op } from 'sequelize';
import Client from '../models/Client';

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
    const { id, name, address, contract, cellphone } = await Client.create(
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

    const client = await Client.findByPk(id);

    if (name && name !== client.name) {
      const clientExist = await Client.findOne({
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

    const clients = await Client.findAll({
      where: {
        name: {
          [Op.iLike]: search,
        },
      },
    });
    return res.json(clients);
  }
}

export default new ClientController();
