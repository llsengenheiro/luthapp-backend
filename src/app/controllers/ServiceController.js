import * as Yup from 'yup';
import Service from '../models/Service';

class ServiceController {
  async store(req, res) {
    const schema = Yup.object().shape({
      client_id: Yup.number()
        .integer()
        .required(),
      type: Yup.string().required(),
      defect: Yup.string().required(),
      status: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Falha na validação' });
    }

    const { client_id, type, defect, status } = req.body;

    const service = await Service.create({
      user_id: req.userId,
      client_id,
      type,
      defect,
      status,
    });

    return res.json(service);
  }
}
export default new ServiceController();
