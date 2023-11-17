const Sequelize = require('sequelize');
const dotenv = require('dotenv');
// import Sequelize from 'sequelize';
// import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: process.env.DB_CONNECTION,
  port: process.env.DB_PORT,
});


module.exports = sequelize;