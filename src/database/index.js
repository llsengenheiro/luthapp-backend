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
    if (process.env.DATABASE_URL) {
      console.log('teste');
      // the application is executed on Heroku ... use the postgres database
      this.connection = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        // port: match[4],
        // host: match[3],
        logging: true, // false
      });
    } else {
      // the application is executed on the local machine ... use mysql
      this.connection = new Sequelize(databaseConfig);
    }

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
