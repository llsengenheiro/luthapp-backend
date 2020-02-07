import { Router } from 'express';

import UserContoller from './app/controllers/UserController';
import ClientController from './app/controllers/ClientContoller';

import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserContoller.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/clients', ClientController.store);
routes.put('/clients', ClientController.update);

routes.put('/users', UserContoller.update);

export default routes;