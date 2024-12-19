const router = require("express").Router();
const { Op } = require("sequelize");
const Invoice = require("../models/Invoice");
const InvoiceDetails = require("../models/invoice_detail");

router.post("/", async ( req, res) => {
    try {
        let body ={...req.body}
        const invoice = await Invoice.create(body);

        const inv_det = req.body.invoice_line.map( async d => {
            await InvoiceDetails.create({
                invoice_id: invoice.id,
                ...d
            })
        })
        await Promise.all(inv_det);
        res.status(201).json(invoice);

    }catch (error){
        res.status(400).json({ error: error.message })
    }
})

router.get("/", async (req, res) => {
    try {
      const invoices = await Invoice.findAll({
        include: [InvoiceDetails], // Incluye los detalles asociados
      });
      res.status(200).json(invoices);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const invoice = await Invoice.findByPk(req.params.id, {
        include: [InvoiceDetails], // Incluye los detalles asociados
      });
  
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
  
      res.status(200).json(invoice);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const invoice = await Invoice.findByPk(req.params.id);
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
  
      await invoice.update(req.body);
  
      // Actualizar detalles de factura
      if (req.body.detail && req.body.detail.length > 0) {
        await InvoiceDetails.destroy({ where: { invoice_id: invoice.id } });
  
        const inv_det = req.body.detail.map(async d => {
          await InvoiceDetails.create({
            invoice_id: invoice.id,
            ...d,
          });
        });
        await Promise.all(inv_det);
      }
  
      res.status(200).json(invoice);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  router.delete("/:id", async (req, res) => {
    try {
      const invoice = await Invoice.findByPk(req.params.id);
  
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
  
      await invoice.destroy(); // Se eliminarán automáticamente los detalles si se configuró `CASCADE`
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  module.exports = router;