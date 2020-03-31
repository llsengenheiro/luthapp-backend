"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
var _util = require('util');

var _auth = require('../../config/auth'); var _auth2 = _interopRequireDefault(_auth);

exports. default = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não enviado' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await _util.promisify.call(void 0, _jsonwebtoken2.default.verify)(token, _auth2.default.secret);

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
