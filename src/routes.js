import { Router } from 'express';

import UserContoller from './app/controllers/UserController';
import ClientController from './app/controllers/ClientContoller';

import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

import ServiceContoller from './app/controllers/ServiceController';

import OrderController from './app/controllers/OrderController';

import ServicePedingController from './app/controllers/ServicePedingController';

import TechnicalController from './app/controllers/TechnicalController';

import TechnicalOrdersController from './app/controllers/TechnicalOrdersController';

import OderOpenController from './app/controllers/OrderOpenController';

const routes = new Router();

routes.post('/users', UserContoller.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/clients', ClientController.store);
routes.put('/clients', ClientController.update);
routes.get('/clients', ClientController.index);

routes.put('/users', UserContoller.update);
routes.get('/users', UserContoller.index);

routes.post('/services', ServiceContoller.store);

routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);

routes.get('/services/peding', ServicePedingController.index);

routes.get('/technical', TechnicalController.index);

routes.get('/technicalorders', TechnicalOrdersController.index);

routes.get('/orderopen', OderOpenController.index);

export default routes;
