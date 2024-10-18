const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const request_analysis = sequelize.define('request_analysis', {
  request_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'request', // nombre de la tabla de Solicitudes
        key: 'id',
      },
      allowNull: false,
    },
    analysis_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'analysis', // nombre de la tabla de Análisis
        key: 'id',
      },
      allowNull: false,
    },
  }, {
    tableName: 'request_analysis',
    timestamps: false,
  });
  
  module.exports = request_analysis;
  