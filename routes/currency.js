const express = require('express');
const router = express()
const Currency = require('../models/Currency');

// Controlador para obtener todas las monedas

router.get('/',async (req, res) => {
  try {
    const currencies = await Currency.findAll();
    res.status(200).json(currencies);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las monedas.' });
  }
});


module.exports = router;
