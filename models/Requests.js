const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const requests = sequelize.define('requests', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    observation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'requests',
  });
  
  // Relaciones
  requests.associate = (models) => {
    // Relación uno a muchos con Pacientes
    requests.belongsTo(models.Paciente, {
      foreignKey: 'patient_id',
      as: 'patient',
    });
  
    // Relación muchos a muchos con Análisis a través de la tabla intermedia SolicitudAnalisis
    requests.belongsToMany(models.Analisis, {
      through: 'request_analysis', // Nombre de la tabla intermedia
      foreignKey: 'request_id',
      otherKey: 'analysis_id',
      as: 'analysis',
    });
  };
  
  module.exports = requests;