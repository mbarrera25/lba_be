// controllers/analysisController.js
const express = require('express');
const router = express.Router();

const Analysis = require("../models/Analysis");
const Test = require('../models/Test');
const TestDetail = require('../models/TestDetail');
const AnalysisTest = require('../models/AnalysisTests');

router.post("/", async (req, res) => {
  try {
    let  body  = req.body
    body = {...body, currency: "usd"}
    const analysis = await Analysis.create(body);

     // Crear la relación en la tabla de unión
     const relations = req.body.Test.map( async t => {
         await AnalysisTest.create({
        AnalysisId: analysis.id,
        TestId: t.id,
      });
     })
     await Promise.all(relations);
    res.status(201).json(analysis);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { page, size, search } = req.query;
    const limit = size ? parseInt(size) : 10;
    const offset = (page ? parseInt(page) - 1 : 0) * limit;

    let where = {};
    if (search) {
      where = {
        name: {
          [Op.like]: `%${search}%`,
        },
      };
    }
    const analyses = await Analysis.findAndCountAll({
      where,
      limit,
      offset,
      include: {
        model: Test,
        through: { attributes: [] } // Esto excluirá los atributos de la tabla de unión
      }
    });
    res
      .status(200)
      .json({
        data: analyses.rows,
        meta: { 
            total: analyses.count, 
            page: parseInt(page) || 1, 
            size: limit },
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const analysis = await Analysis.findByPk(req.params.id);
    if (analysis) {
      res.status(200).json(analysis);
    } else {
      res.status(404).json({ error: "Analysis not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const [updated] = await Analysis.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedAnalysis = await Analysis.findByPk(req.params.id);
      res.status(200).json(updatedAnalysis);
    } else {
      res.status(404).json({ error: "Analysis not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Analysis.destroy({
      where: { id: req.params.id }, 
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
