const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Talonario = sequelize.define('Talonario', {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nroActual: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nroInicial: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nroFinal: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    serie: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    estatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    tableName: 'talonarios'
  });
  
  module.exports = Talonario;