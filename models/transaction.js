
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Configura la conexión de tu base de datos

const Transaction = sequelize.define('transaction', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  patient: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  type_transaction: { // debit, cash, tc..
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount_bs: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  amount_usd: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  exchange_rate: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: false,
  },
  debit_amount_bs: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  debit_amount_usd: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  cash_amount_bs: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  cash_amount_usd: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  electronic_amount_bs: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  electronic_amount_usd: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  request_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'transactions',
});

module.exports = Transaction;
