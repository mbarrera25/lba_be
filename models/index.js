const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user');

// Sincronizar todos los modelos con la base de datos
const initDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ force: false });
    console.log('Database synchronized.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = {
  initDb,
  User
};
