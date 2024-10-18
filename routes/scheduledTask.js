const cron = require("node-cron");
const ExchangeCurrency = require("../models/exchange_currency"); // Ajusta la ruta a tus modelos
const Currency = require("../models/currency"); // Ajusta la ruta a tus modelos
const axios = require("axios");
const { Op } = require('sequelize');
const ExchangeRateLog = require("../models/exchange_rate_log")
const moment = require('moment');

// Función para obtener la tasa de cambio y guardarla en la base de datos
async function fetchAndSaveExchangeRate() {
  try {
    const response = await axios.get(
      "https://v6.exchangerate-api.com/v6/aa44279955ea67f215974911/latest/USD",
      {
        headers: { apikey: "aa44279955ea67f215974911" },
      }
    );

    const rateData = response.data.conversion_rates.VES;

    const currency = await Currency.findOne({ where: { iso: "USD" } });

    if (!currency) {
      throw new Error("Moneda no encontrada");
    }
     // Utiliza moment para crear la fecha formateada
     const formattedDate = moment().format("YYYY-MM-DD"); // Formato ISO
    
    const existingRate = await ExchangeCurrency.findOne({
      where: {
        currency_id: currency.id,
        date: {
          [Op.eq]: formattedDate,
        },
      },
    });
    if (existingRate) {
      existingRate.rate = rateData;
      existingRate.date = formattedDate; // Actualiza la fecha si es necesario
      await existingRate.save();
      await ExchangeRateLog.create({ status: "Success", message: "Tasa de cambio actualizada: " + existingRate });
      console.log("Tasa de cambio actualizada:", existingRate);
    } else {
      const newExchangeRate = {
        currency_id: currency.id,
        rate: rateData,
        date: formattedDate,
      };

      await ExchangeCurrency.create(newExchangeRate);
      await ExchangeRateLog.create({ status: "Success", message: "Tasa de cambio guardada: " + JSON.stringify(newExchangeRate) });
      console.log("Tasa de cambio guardada:", newExchangeRate);
    }
  } catch (error) {
    console.error(
      "Error al obtener o guardar la tasa de cambio:",
      error.message
    );
    await ExchangeRateLog.create({ status: "Error", message: "Error al obtener o guardar la tasa de cambio: " + error.message });
    
  }
}

// Programar la tarea para que se ejecute todos los días a las 10.30 Y 3.30 PM
cron.schedule("30 10,15 * * *", fetchAndSaveExchangeRate, {
  scheduled: true,
  timezone: "America/Caracas",
});

module.exports = fetchAndSaveExchangeRate;
