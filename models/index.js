const sequelize = require('../config/database');
const User = require('./user');
const Test = require('./Test');
const TestDetails = require('./TestDetail');
const Analysis = require('./Analysis');
const bcrypt = require('bcryptjs');

// Sincronizar todos los modelos con la base de datos
const initDb = async () => {
  try {
    // Definir relaciones
    Test.hasMany(TestDetails, { foreignKey: 'testId',  onDelete: 'CASCADE'  });
    TestDetails.belongsTo(Test, { foreignKey: 'testId' });

    Analysis.belongsToMany(Test, { through: 'AnalysisTests' });
    Test.belongsToMany(Analysis, { through: 'AnalysisTests' });

    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    await sequelize.sync({ force: false });
    console.log('Database synchronized.');

    const adminUser = await User.findOne({ where: { email: 'admin@d' } });
    if (!adminUser) {
      const pass =  await bcrypt.hash('admin', 10)
      console.log(pass);
      await User.create({
        email: 'admin@d',
        password: pass,
        nombres: 'Administrador',
        rol: 'admin'
      });
      console.log('Usuario administrador creado');
    } else {
      console.log('Usuario administrador ya existe');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = initDb;
