const {DataTypes} = require('sequelize');
const sequelize = require('../../config/database.js');
// import DataTypes from 'sequelize';
// import sequelize from '../../config/database.js';

const Product = sequelize.define('product',{
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name:{
    type: DataTypes.STRING,
    allowNull: false,
  },
  stock:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status:{
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  imageUrl:{
    type: DataTypes.TEXT
  }
},{
  freezeTableName: true,
  paranoid: true,
});

module.exports = Product;