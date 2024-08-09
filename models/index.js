const sequelize = require('../config/database');
const User = require('./user');
const Test = require('./Test');
const TestDetails = require('./TestDetail');
const Analysis = require('./Analysis');
const ExchangeCurrency = require('./ExchangeCurrency');
const bcrypt = require('bcryptjs');
const Currency = require('./Currency');
const MetodoDePago = require('./metodoDePago')

// Sincronizar todos los modelos con la base de datos
const initDb = async () => {
  try {
    // Definir relaciones
    Test.hasMany(TestDetails, { foreignKey: 'testId',  onDelete: 'CASCADE'  });
    TestDetails.belongsTo(Test, { foreignKey: 'testId' });

    Analysis.belongsToMany(Test, { through: 'analysis_test', onDelete: 'CASCADE' });
    Test.belongsToMany(Analysis, { through: 'analysis_test', onDelete: 'CASCADE' });


    Currency.hasMany( ExchangeCurrency, { foreignKey: 'currencyId'});
    ExchangeCurrency.belongsTo(Currency, { foreignKey: 'currencyId'});
    
    Currency.hasMany(MetodoDePago, { foreignKey: 'currencyId'})
    MetodoDePago.belongsTo(Currency, { foreignKey: 'currencyId'});
    


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

    const monUsd = await Currency.findOne({ where: { iso: 'USD' } })
    if ( !monUsd ){
      await Currency.create({
        nombre: 'Dolar USD',
        iso: 'USD',
        simbolo: '$',
        activa: true,

      })
    }
    const monVes = await Currency.findOne({ where: { iso: 'VES' } })
    if ( !monVes ){
      await Currency.create({
        nombre: 'Bolivar BS',
        iso: 'VES',
        simbolo: 'Bs.',
        activa: true,
        
      })
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = initDb;
