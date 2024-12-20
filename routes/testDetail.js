const express = require('express');
const router = express.Router();
const TestDetail = require('../models/test_detail');
const Test = require('../models/Test');

// Crear un nuevo TestDetail
router.post('/', async (req, res) => {
  try {
    console.log(req.body);
    const testDetail = await TestDetail.create(req.body);
    res.status(201).json(testDetail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos los TestDetails
router.get('/', async (req, res) => {
  try {
    const testDetails = await TestDetail.findAll({ include: Test });
    res.status(200).json(testDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener un TestDetail por ID
router.get('/:id', async (req, res) => {
  try {
    const testDetail = await TestDetail.findByPk(req.params.id, { include: Test });
    if (!testDetail) {
      return res.status(404).json({ message: 'TestDetail not found' });
    }
    res.status(200).json(testDetail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar un TestDetail
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await TestDetail.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ message: 'TestDetail not found' });
    }
    const updatedTestDetail = await TestDetail.findByPk(req.params.id, { include: Test });
    res.status(200).json(updatedTestDetail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar un TestDetail
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await TestDetail.destroy({
      where: { id: req.params.id }
    });
    if (!deleted) {
      return res.status(404).json({ message: 'TestDetail not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
