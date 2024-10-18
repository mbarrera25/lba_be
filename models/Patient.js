// models/Patient.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date_birth: {
    type: DataTypes.DATE,
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM,
    values: ['masculino', 'femenino'],
    allowNull: false
  },
  identification: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  // Información de contacto
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Información clínica
  blood_type: {
    type: DataTypes.STRING,
    allowNull: true
  },
  medical_history: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  allergies: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'patient'
});

module.exports = Patient;
