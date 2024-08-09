const cron = require("node-cron");
const ExchangeCurrency = require("../models/ExchangeCurrency"); // Ajusta la ruta a tus modelos
const Currency = require("../models/Currency"); // Ajusta la ruta a tus modelos
const axios = require("axios");
const { Op } = require('sequelize');

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
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
    const existingRate = await ExchangeCurrency.findOne({
      where: {
        currencyId: currency.id,
        date: {
          [Op.eq]: formattedDate,
        },
      },
    });
    if (existingRate) {
      existingRate.rate = rateData;
      existingRate.date = formattedDate; // Actualiza la fecha si es necesario
      await existingRate.save();
      console.log("Tasa de cambio actualizada:", existingRate);
    } else {
      const newExchangeRate = {
        currencyId: currency.id,
        rate: rateData,
        date: formattedDate,
      };

      await ExchangeCurrency.create(newExchangeRate);
      console.log("Tasa de cambio guardada:", newExchangeRate);
    }
  } catch (error) {
    console.error(
      "Error al obtener o guardar la tasa de cambio:",
      error.message
    );
  }
}

// Programar la tarea para que se ejecute todos los días a las 10.30 Y 3.30 PM
cron.schedule("30 10,15 * * *", fetchAndSaveExchangeRate, {
  scheduled: true,
  timezone: "America/Caracas",
});

module.exports = fetchAndSaveExchangeRate;
