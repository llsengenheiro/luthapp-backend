import Sequelize from 'sequelize';

import User from '../app/models/User';
import Client from '../app/models/Client';
import Service from '../app/models/Service';
import Order from '../app/models/Order';

import databaseConfig from '../config/database';

const models = [User, Client, Service, Order];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(process.env.DATABASE_URL);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
