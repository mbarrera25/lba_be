const express = require('express');
const router = express()
const ExchangeCurrency = require('../models/exchange_currency')
const Currency = require('../models/currency')

// Crear una tasa
router.post('/', async (req, res) => {
    const { moneda, tasa, fecha } = req.body;
  
    try {
      // Buscar la moneda por su código (ISO)
      const currency = await Currency.findOne({ where: { iso: moneda } });
  
      if (!currency) {
        return res.status(404).json({ error: 'Moneda no encontrada' });
      }
  
      // Crear el objeto con el ID de la moneda
      const newExchangeRate = {
        currency_id: currency.id,
        rate: tasa,
        date: new Date(fecha)
      };
  
      // Crear la nueva tasa en la base de datos
      const exchangeRates = await ExchangeCurrency.create(newExchangeRate);
  
      res.status(201).json(exchangeRates);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  // Obtener tasas de cambio ordenadas por fecha de manera descendente y paginada
router.get('/', async (req, res) => {
    try {
      // Obtener parámetros de paginación de la solicitud (página y límite)
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
  
      // Obtener tasas de cambio ordenadas por fecha descendente
      const exchangeRates = await ExchangeCurrency.findAll({
        order: [['date', 'DESC']],
        limit: limit,
        offset: offset,
        include: Currency
      });
  
      res.status(200).json(exchangeRates);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });


  module.exports = router;