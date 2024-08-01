// routes/analysistest.js
const express = require('express');
const router = express.Router();
const Test = require('../models/Test');
const Analysis = require('../models/Analysis');
const AnalysisTest = require('../models/AnalysisTests');


// Ruta para crear una relación entre un Analysis y un Test
router.post('/', async (req, res) => {
  const { analysisId, testId } = req.body;

  try {
    // Crear la relación en la tabla de unión
    const newRelation = await AnalysisTest.create({
      AnalysisId: analysisId,
      TestId: testId,
    });

    res.status(201).json(newRelation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
    try {
      const deleted = await AnalysisTest.destroy({
        where: { TestId: req.params.id }, 
      });
      if (deleted) {
        res.status(204).json();
      } else {
        res.status(404).json({ error: "Analysis not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

module.exports = router;
