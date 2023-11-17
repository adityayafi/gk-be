const {DataTypes} = require('sequelize');
const sequelize = require('../../config/database.js');
// import { DataTypes } from 'sequelize';
// import sequelize from '../../config/database.js';

const Users = sequelize.define('users',{
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user'
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: true
  }
},{
  freezeTableName: true,
});

module.exports = Users;
