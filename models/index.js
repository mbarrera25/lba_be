const sequelize = require("../config/database");
const User = require("./user");
const Test = require("./test");
const TestDetails = require("./test_detail");
const Analysis = require("./analysis");
const exchange_currency = require("./exchange_currency");
const Currency = require("./currency");
const payment_method = require("./payment_method");
const Requests = require("./Requests");
const Patient = require("./patient");
const bcrypt = require("bcryptjs");

// Sincronizar todos los modelos con la base de datos
const initDb = async () => {
  try {
    // Definir relaciones
    Test.hasMany(TestDetails, { foreignKey: "test_id", onDelete: "CASCADE" });
    TestDetails.belongsTo(Test, { foreignKey: "test_id" });
    // Relaciones de Analysis
    Analysis.belongsToMany(Test, {
      through: "analysis_test",
      onDelete: "CASCADE",
    });
    Test.belongsToMany(Analysis, {
      through: "analysis_test",
      onDelete: "CASCADE",
    });

    // Relaciones de ExchangeCurrency
    Currency.hasMany(exchange_currency, { foreignKey: "currency_id" });
    exchange_currency.belongsTo(Currency, { foreignKey: "currency_id" });

    // Relaciones de ExchangeCurrency
    Currency.hasMany(payment_method, { foreignKey: "currency_id" });
    payment_method.belongsTo(Currency, { foreignKey: "currency_id" });

    // Relaciones de Solicitud
    Requests.belongsTo(Patient, {
      foreignKey: "patient_id",
      as: "patient",
      onDelete: "CASCADE",
    });
    Requests.belongsToMany(Analysis, {
      through: "request_analysis",
      foreignKey: "request_id",
      otherKey: "analysis_id",
      as: "analysis",
      onDelete: "CASCADE",
    });
    Analysis.belongsToMany(Requests, {
      through: "request_analysis",
      foreignKey: "analysis_id",
      otherKey: "request_id",
      as: "request",
      onDelete: "CASCADE",
    });

    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    await sequelize.sync({ force: false });
    console.log("Database synchronized.");

    // Crear usuario administrador por defecto
    const adminUser = await User.findOne({ where: { email: "admin@d" } });
    if (!adminUser) {
      const pass = await bcrypt.hash("admin", 10);
      console.log(pass);
      await User.create({
        email: "admin@d",
        password: pass,
        names: "Administrador",
        role: "admin",
      });
      console.log("Usuario administrador creado");
    } else {
      console.log("Usuario administrador ya existe");
    }
    // Crear monedas por defecto
    const monUsd = await Currency.findOne({ where: { iso: "USD" } });
    if (!monUsd) {
      await Currency.create({
        name: "Dolar USD",
        iso: "USD",
        symbol: "$",
        active: true,
      });
    }
    const monVes = await Currency.findOne({ where: { iso: "VES" } });
    if (!monVes) {
      await Currency.create({
        name: "Bolivar BS",
        iso: "VES",
        symbol: "Bs.",
        active: true,
      });
    }
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = initDb;
