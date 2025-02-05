const router = require("express").Router();
const { Op } = require("sequelize");
const Invoice = require("../models/Invoice");
const InvoiceDetails = require("../models/invoice_detail");
const puppeteer = require('puppeteer');
const path = require("path");
const fs = require("fs");
const { formatDate } = require('./services/utils');

router.post("/", async (req, res) => {
  try {
    // Crear la factura
    const body = { ...req.body };
    const invoice = await Invoice.create(body);

    // Crear las líneas de la factura
    const inv_det_promises = req.body.invoice_line.map(async (d) => {
      return await InvoiceDetails.create({
        invoice_id: invoice.id,
        ...d
      });
    });
    const invoice_line = await Promise.all(inv_det_promises);

    // Devolver la factura con sus líneas
    res.status(201).json({
      ...invoice.toJSON(), // Convierte la factura a JSON
      invoice_line, // Incluye las líneas
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


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

router.get("/:invoiceId/download", async (req, res) => {
  try {
    const { invoiceId } = req.params;

    // Obtener la factura con sus líneas
    const invoice = await Invoice.findByPk(invoiceId, { include: InvoiceDetails });
    if (!invoice) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }


    const templatePath = path.join(__dirname, "./templates/invoiceTemplate.html");
    let htmlTemplate = fs.readFileSync(templatePath, "utf8");
    let date = new Date(invoice.date_at);
    const formattedDate = formatDate(date);
    htmlTemplate = htmlTemplate.replace("{{date}}", formattedDate);

    const itemsHtml = invoice.invoice_details.map(item => `
      <tr>
        <td>${item.quantity}</td>
        <td>${item.description}</td>
        <td>${'Bs. '} ${item.price.toFixed(2)}</td>
        <td>${'Bs. '} ${item.total.toFixed(2)}</td>
      </tr>
    `).join("");
    console.log(itemsHtml);
    console.log(invoice.total_amount.toFixed(2), 'total_amount');
    

    htmlTemplate = htmlTemplate
      .replace(/{{name}}/g, invoice.name)
      .replace(/{{identification}}/g, invoice.identification)
      .replace(/{{direction}}/g, invoice.direction)
      .replace(/{{invoice_number}}/g, invoice.invoice_number)
      .replace(/{{moneda}}/g, 'Bs.')
      .replace(/{{subtotal_amount}}/g, invoice.subtotal_amount.toFixed(2))
      .replace(/{{igtf}}/g, invoice.igtf.toFixed(2))
      .replace(/{{total_amount}}/g, invoice.total_amount.toFixed(2))
      .replace(/{{pay_method}}/g, invoice.pay_method)
      .replace(/{{date}}/g, formattedDate)
      .replace(/{{items}}/g, itemsHtml);


    // Generar PDF con Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlTemplate, { waitUntil: "load" });

    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    // Enviar PDF al cliente
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=factura_${invoiceId}.pdf`);
    res.end(pdfBuffer);

  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: error.message });
    }
  }
});
module.exports = router;