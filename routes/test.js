const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const Test = require('../models/Test');
const TestDetail = require('../models/test_detail');
const upload = multer({ dest: 'uploads/' });

// Crear un nuevo test junto con sus detalles
router.post('/', async (req, res) => {
  const { code, name, description, price, date, TestDetails } = req.body;

  try {
    // Crear el test
    const test = await Test.create({ code, name, description, price, date });

    // Crear los detalles del test
    if (TestDetails && TestDetails.length > 0) {
      const testDetails = TestDetails.map(det => ({
        ...det,
        test_id: test.id
      }));
      await TestDetail.bulkCreate(testDetails);
    }

    // Consultar el test con sus detalles y devolverlo en la respuesta
    const createdTest = await Test.findOne({
      where: { id: test.id },
      include: [TestDetail]
    });

    res.status(201).json(createdTest);
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
      const { TestDetails } = req.body
      for (const detail of TestDetails) {
        await TestDetail.upsert({...detail, test_id: test.id});
      }
      res.status(200).json(test);
    } else {
      res.status(404).json({ error: 'Test not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Obtener todos los tests con paginación
router.get('/', async (req, res) => {
  try {
    const { page, size, search } = req.query;
    const limit = size ? parseInt(size) : 10;
    const offset = (page ? parseInt(page) - 1 : 0) * limit;

    let where = {};
    if (search) {
      where = {
        name: {
          [Op.like]: `%${search}%`
        }
      };
    }

    const tests = await Test.findAndCountAll({
      where,
      limit,
      offset,
      include: TestDetail
    });

    res.status(200).json({
      data: tests.rows,
      meta: {
        total: tests.count,
        page: parseInt(page) || 1,
        size: limit,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/search', async (req, res) => {
  const  query  = req.query.search;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const tests = await Test.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { code: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
        ],
      },
    });
  res.status(200).json(tests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }

});


// Obtener un test por ID
router.get('/:id', async (req, res) => {
  try {
    console.log("Soy get/:id")
    const test = await Test.findByPk(req.params.id, {include: TestDetail});
    if (test) {
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
    const test = await Test.findByPk(req.params.id,{ include: TestDetail});
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

// Crear un nuevo lote de tests junto con sus detalle

router.post('/bulk', async (req, res) => {
  const tests = req.body.tests; // Se espera que los tests y sus detalles se pasen en el cuerpo de la solicitud
  console.log('*****************************************************************')
  console.log(tests.size,' son --> tests')
  console.log('*****************************************************************')
  try {
    // Crear los tests
    const createdTests = await Test.bulkCreate(tests, { returning: true });

    // Crear los detalles de los tests
    const testDetails = [];
    createdTests.forEach((test, index) => {
      if (tests[index].TestDetails && tests[index].TestDetails.length > 0) {
        tests[index].TestDetails.forEach(detail => {
          testDetails.push({
            ...detail,
            test_id: test.id
          });
        });
      }
    });

    await TestDetail.bulkCreate(testDetails);

    // Consultar los tests con sus detalles y devolverlos en la respuesta
    const result = await Test.findAll({
      where: { id: createdTests.map(test => test.id) },
      include: [TestDetail]
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
