// routes/talonario.js
const express = require('express');
const router = express.Router();
const Talonario = require('../models/talonario');

// GET all talonarios
router.get('/', async (req, res) => {
  try {
    const talonarios = await Talonario.findAll();
    res.json(talonarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single talonario by ID
router.get('/:id', async (req, res) => {
  try {
    const talonario = await Talonario.findByPk(req.params.id);
    if (talonario) {
      res.json(talonario);
    } else {
      res.status(404).json({ error: 'Talonario not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new talonario
router.post('/', async (req, res) => {
  try {
    const newTalonario = await Talonario.create(req.body);
    res.status(201).json(newTalonario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update an existing talonario
router.put('/:id', async (req, res) => {
  try {
    const updated = await Talonario.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated[0]) {
      const updatedTalonario = await Talonario.findByPk(req.params.id);
      res.json(updatedTalonario);
    } else {
      res.status(404).json({ error: 'Talonario not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE remove a talonario
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Talonario.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Talonario not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
