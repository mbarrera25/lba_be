const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const book_payment = sequelize.define('book_payment', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nro_current: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nro_initial: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nro_end: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    serie: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    tableName: 'book_payment'
  });
  
  module.exports = book_payment;