"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _express = require('express');

var _UserController = require('./app/controllers/UserController'); var _UserController2 = _interopRequireDefault(_UserController);
var _ClientContoller = require('./app/controllers/ClientContoller'); var _ClientContoller2 = _interopRequireDefault(_ClientContoller);

var _SessionController = require('./app/controllers/SessionController'); var _SessionController2 = _interopRequireDefault(_SessionController);

var _auth = require('./app/middlewares/auth'); var _auth2 = _interopRequireDefault(_auth);

var _ServiceController = require('./app/controllers/ServiceController'); var _ServiceController2 = _interopRequireDefault(_ServiceController);

var _OrderController = require('./app/controllers/OrderController'); var _OrderController2 = _interopRequireDefault(_OrderController);

var _OrderOpenController = require('./app/controllers/OrderOpenController'); var _OrderOpenController2 = _interopRequireDefault(_OrderOpenController);

var _OrderTechnicalAcceptController = require('./app/controllers/OrderTechnicalAcceptController'); var _OrderTechnicalAcceptController2 = _interopRequireDefault(_OrderTechnicalAcceptController);

var _ServicePedingController = require('./app/controllers/ServicePedingController'); var _ServicePedingController2 = _interopRequireDefault(_ServicePedingController);

var _TechnicalController = require('./app/controllers/TechnicalController'); var _TechnicalController2 = _interopRequireDefault(_TechnicalController);

const routes = new (0, _express.Router)();

routes.get('/', (req, res) => {
  res.json('Teste');
});

routes.post('/users', _UserController2.default.store);
routes.post('/sessions', _SessionController2.default.store);

routes.use(_auth2.default);

routes.post('/clients', _ClientContoller2.default.store);
routes.put('/clients', _ClientContoller2.default.update);
routes.get('/clients', _ClientContoller2.default.index);

routes.put('/users', _UserController2.default.update);
routes.get('/users', _UserController2.default.index);

routes.post('/services', _ServiceController2.default.store);

routes.post('/orders', _OrderController2.default.store);
routes.get('/orders', _OrderController2.default.index);
routes.put('/orders', _OrderController2.default.update);
routes.delete('/orders', _OrderController2.default.delete);

routes.get('/services/peding', _ServicePedingController2.default.index);

routes.get('/technical', _TechnicalController2.default.index);

routes.get('/orderopen', _OrderOpenController2.default.index);

routes.put('/order/technical/accept', _OrderTechnicalAcceptController2.default.update);

exports. default = routes;
