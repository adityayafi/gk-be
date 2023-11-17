'use strict';
// import * as url from 'url';
// import fs from 'fs';
// import path from 'path';
// import Sequelize from 'sequelize';
// import process from 'process';
// import { fileURLToPath } from 'url';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
// const __dirname = url.fileURLToPath(new URL(import.meta.url));
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
// console.log(__dirname, 'ini dirname')
// import config from __dirname + '../config.json'[env];
// import config from '../config/config.json' assert {type : "json"};
const config = require(__dirname + '/../config/config.js')[env];
const db = {};


// console.log(process.env[config.use_env_variable], 'ini env')
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {host: config.host, dialect: config.dialect, port: config.port});
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

console.log(db.users)

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
// export default db;
