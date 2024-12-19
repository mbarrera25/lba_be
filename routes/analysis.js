// controllers/analysisController.js
const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");
const Analysis = require("../models/analysis");
const Test = require('../models/test');
const TestDetail = require('../models/test_detail');
const AnalysisTest = require('../models/analysis_Tests');

router.post("/", async (req, res) => {
  try {
    let  body  = req.body
    body = {...body, currency: "usd"} //revisar currency agregar relacion con moneda
    const analysis = await Analysis.create(body);

     // Crear la relación en la tabla de unión
     const relations = req.body.Tests.map( async t => {
         await AnalysisTest.create({
        analysis_id: analysis.id,
        test_id: t.id,
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
// Buscar análisis por nombre, código o descripción
router.get("/search", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const analyses = await Analysis.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { code: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
      ]
      },include: {
        model: Test,
        through: { attributes: [] } // Esto excluirá los atributos de la tabla de unión
      }
    });
    res.status(200).json(analyses);
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
