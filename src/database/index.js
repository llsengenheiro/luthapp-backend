import Sequelize from 'sequelize';

import User from '../app/models/User';
import Client from '../app/models/Client';

import databaseConfig from '../config/database';

const models = [User, Client];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
  }
}

export default new Database();
