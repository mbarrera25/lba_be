// routes/talonario.js
const express = require('express');
const router = express.Router();
const Talonario = require('../models/book_payment');

// GET all talonarios
router.get('/', async (req, res) => {
  try {
    const talonarios = await Talonario.findAll();
    res.json(talonarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/filtered', async (req, res) => {
  try {
    const { type } = req.query;
    console.log(type);

    if (!type) {
      return res.status(400).json({ error: 'The type parameter is required.' });
    }

    const bookPayments = await Talonario.findAll({
      where: {
        type: type,
        status: true,
      }
    });

    if (bookPayments.length > 0) {
      res.json(bookPayments);
    } else {
      res.status(404).json({ error: 'No active book payments found for the specified type.' });
    }
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

// PUT increment nro_current
router.put('/:id/increment', async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el talonario por ID
    const talonario = await Talonario.findByPk(id);

    if (!talonario) {
      return res.status(404).json({ error: 'Talonario not found' });
    }

    // Verificar que nro_current no exceda nro_end
    if (talonario.nro_current >= talonario.nro_end) {
      return res.status(400).json({ error: 'Cannot increment beyond nro_end' });
    }

    // Incrementar nro_current
    talonario.nro_current += 1;

    // Guardar cambios
    await talonario.save();

    res.json(talonario);
  } catch (err) {
    console.error(err);
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
