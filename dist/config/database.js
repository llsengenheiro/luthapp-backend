"use strict";require('dotenv/config');

if (process.env.NODE_ENV === 'development') {
  module.exports = {
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
  };
} else {
  module.exports = {
    stringConecction:
      (process.env.DATABASE_URL,
      {
        dialect: 'postgres',
        protocol: 'postgres',
        port: 5432,
        host: 'ec2-52-6-143-153.compute-1.amazonaws.com',
        logging: true, // false
      }),
  };
}
