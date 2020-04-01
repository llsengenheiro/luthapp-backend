"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

var _User = require('../app/models/User'); var _User2 = _interopRequireDefault(_User);
var _Client = require('../app/models/Client'); var _Client2 = _interopRequireDefault(_Client);
var _Service = require('../app/models/Service'); var _Service2 = _interopRequireDefault(_Service);
var _Order = require('../app/models/Order'); var _Order2 = _interopRequireDefault(_Order);

var _database = require('../config/database'); var _database2 = _interopRequireDefault(_database);

const models = [_User2.default, _Client2.default, _Service2.default, _Order2.default];

class Database {
  constructor() {
    this.init();
  }

  init() {
    if (process.env.DATABASE_URL) {
      console.log('teste');
      // the application is executed on Heroku ... use the postgres database
      this.connection = new (0, _sequelize2.default)(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        // port: match[4],
        // host: match[3],
        logging: true, // false
      });
    } else {
      // the application is executed on the local machine ... use mysql
      this.connection = new (0, _sequelize2.default)(_database2.default);
    }

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

exports. default = new Database();
