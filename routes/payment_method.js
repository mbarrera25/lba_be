const express = require("express");
const router = express.Router();
const MetodoDePago = require("../models/payment_method");
const Currency = require("../models/Currency");

// GET all metodos de pago
router.get("/", async (req, res) => {
  try {
    const { page, size, search } = req.query;
    const limit = size ? parseInt(size) : 10;
    const offset = (page ? parseInt(page) - 1 : 0) * limit;

    const metodos = await MetodoDePago.findAll({
      limit: limit,
      offset: offset,
      include: Currency,
    });
    res.status(200).json(metodos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single metodo de pago by ID
router.get("/:id", async (req, res) => {
  try {
    const metodo = await MetodoDePago.findByPk(req.params.id);
    if (metodo) {
      res.json(metodo);
    } else {
      res.status(404).json({ error: "Método de Pago no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new metodo de pago
router.post("/", async (req, res) => {
  try {
    const newMetodo = await MetodoDePago.create(req.body);
    res.status(201).json(newMetodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update an existing metodo de pago
router.put("/:id", async (req, res) => {
  try {
    const updated = await MetodoDePago.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated[0]) {
      const updatedMetodo = await MetodoDePago.findByPk(req.params.id);
      res.json(updatedMetodo);
    } else {
      res.status(404).json({ error: "Método de Pago no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE remove a metodo de pago
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await MetodoDePago.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: "Método de Pago no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
