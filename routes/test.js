const express = require('express');
const router = express.Router();
const Test = require('../models/Test');

// Crear un nuevo test
router.post('/', async (req, res) => {
  try {
    const test = await Test.create(req.body);
    res.status(201).json(test);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos los tests
router.get('/', async (req, res) => {
  try {
    const tests = await Test.findAll();
    res.status(200).json(tests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener un test por ID
router.get('/:id', async (req, res) => {
  try {
    const test = await Test.findByPk(req.params.id);
    if (test) {
      res.status(200).json(test);
    } else {
      res.status(404).json({ error: 'Test not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar un test por ID
router.put('/:id', async (req, res) => {
  try {
    const test = await Test.findByPk(req.params.id);
    if (test) {
      await test.update(req.body);
      res.status(200).json(test);
    } else {
      res.status(404).json({ error: 'Test not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar un test por ID
router.delete('/:id', async (req, res) => {
  try {
    const test = await Test.findByPk(req.params.id);
    if (test) {
      await test.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Test not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
