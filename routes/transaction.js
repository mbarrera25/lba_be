const router = require("express").Router();
const { Op } = require("sequelize");
const Transaction = require("../models/transaction")

router.post("/", async (req, res) => {
    try {
        let body = req.body
        const transaction = await Transaction.create(body)
        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

})

router.get("/", async (req, res) => {
    try {
      const transaction = await Transaction.findAll();
      res.status(200).json(transaction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  module.exports = router;