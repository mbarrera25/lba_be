const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InvoiceDetail = sequelize.define('invoice_detail', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  total: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  rate: {
    type: DataTypes.DOUBLE,
    allowNull: false
  }
},{
    tableName: 'invoice_detail'
});

module.exports = InvoiceDetail;
