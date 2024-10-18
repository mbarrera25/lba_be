const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');
const { Op } = require('sequelize');

// Crear un nuevo paciente
router.post('/', async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos los pacientes
router.get('/', async (req, res) => {
  try {
    const { page, size } = req.query;
    const limit = size ? parseInt(size) : 10;
    const offset = (page ? parseInt(page) - 1 : 0) * limit;

    const patients = await Patient.findAll({
      limit,
      offset,
    });
    res.status(200).json(patients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Buscar pacientes por nombre o identificación
router.get('/search', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const patients = await Patient.findAll({
      where: {
        [Op.or]: [
          { full_name: { [Op.iLike]: `%${query}%` } },
          { identification: { [Op.iLike]: `%${query}%` } }
        ],
      },
    });
    res.status(200).json(patients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener un paciente por ID
router.get('/:id', async (req, res) => {
  try {
    console.log(req);
    const patient = await Patient.findByPk(req.params.id);
    if (patient) {
      res.status(200).json(patient);
    } else {
      res.status(404).json({ error: 'Patient not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar un paciente por ID
router.put('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (patient) {
      await patient.update(req.body);
      res.status(200).json(patient);
    } else {
      res.status(404).json({ error: 'Patient not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar un paciente por ID
router.delete('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.params.id);
    if (patient) {
      await patient.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Patient not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



module.exports = router;
