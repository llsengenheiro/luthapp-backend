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
    this.connection = new Sequelize(databaseConfig);
    /**  if (process.env.DATABASE_URL) {
      // the application is executed on Heroku ... use the postgres database
      this.connection = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        port: 5432,
        host: 'ec2-52-6-143-153.compute-1.amazonaws.com',
        logging: true, // false
      });
    } else {
      // the application is executed on the local machine ... use mysql
      this.connection = new Sequelize({
        dialect: 'postgres',
        host: process.env.DB_HOST,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        define: {
          timestamps: true,
          underscored: true,
          underscoredAll: true,
        },
      });
    }
    */

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
