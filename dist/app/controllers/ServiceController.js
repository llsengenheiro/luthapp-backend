"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);
var _Service = require('../models/Service'); var _Service2 = _interopRequireDefault(_Service);
var _onesignal = require('../../config/onesignal'); var _onesignal2 = _interopRequireDefault(_onesignal);

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

    const { client_id, type, defect } = req.body;

    const service = await _Service2.default.create({
      user_id: req.userId,
      client_id,
      type,
      defect,
      status: 'open',
    });

    const message = {
      app_id: 'f5b5d57c-f68c-4802-9e35-b04559addd16',
      contents: { en: 'English Message' },
      included_segments: ['All'],
    };

    _onesignal2.default.sendNotification(message);

    return res.json(service);
  }
}
exports. default = new ServiceController();
