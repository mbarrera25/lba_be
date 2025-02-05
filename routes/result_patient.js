const router = require("express").Router();
const Test = require("../models/Test");
const TestDetail = require("../models/test_detail");
const Analysis = require("../models/Analysis");
const Requests = require("../models/Requests");
const RequestsAnalysis = require("../models/request_analysis");
const ResultPatient = require("../models/Result_patient");
const sequelize = require("../config/database");
const { getResultPatient } = require('./queries/queries'); // Importar las consultas
const { calculateAge, formatDate, groupAnalisys } = require('./services/utils');
const puppeteer = require('puppeteer');
const path = require("path");
const fs = require("fs");

router.get("/get-request/:requestId", async (req, res) => {
  try {
    const { requestId } = req.params;

    const tests = await Analysis.findAll({
      include: [
        {
          model: Test,
          as: "Tests",
          required: false, // LEFT JOIN
          include: [
            {
              model: TestDetail,
              as: "TestDetails", // Incluye los detalles del test
              required: false, // LEFT JOIN para traer todos los detalles
            },
          ],
        },
        {
          model: Requests,
          as: "request", // Alias definido en la relación Analysis -> Requests
          required: true, // INNER JOIN para filtrar únicamente análisis relacionados con un request específico
          through: {
            model: RequestsAnalysis,
            attributes: [], // Tabla intermedia
          },
          where: { id: requestId }, // Filtro para la tabla Requests
        },
      ],
    });
    res.status(200).json(tests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    let body = req.body;
    console.log('paso por aqui');
    console.log(body);

    const result = await ResultPatient.bulkCreate(body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/get-result/:requestId", async (req, res) => {
  try {
    const { requestId } = req.params;
    //  
    const results = await sequelize.query(getResultPatient, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { request_id: requestId }
    });
    res.status(200).json(results);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/printResult/:requestId", async (req, res) => {
  try {
    const { requestId } = req.params;
    //  
    const results = await sequelize.query(getResultPatient, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { request_id: requestId }
    });
    const patient = {
      full_name: results[0].patient,
      date_birth: results[0].date_birth,
      age: calculateAge(results[0].date_birth),
    };

    // Generar el HTML del resultado
    const templatePath = path.join(__dirname, "./templates/resultTemplate.html");
    let htmlTemplate = fs.readFileSync(templatePath, "utf8");
    const analisis = groupAnalisys(results);
    console.log(analisis);

    const itemsHtml = analisis.map(item => `
     <div class="${analisis.length === 1 ? 'col-md-12' : 'col-md-6'}">
          <table>
              <tr>
                  <th lass="text-center" colspan = "3">${item.analisis}</th>
              </tr>
              ${item.pruebas.map(prueba => `
              <tr>
                  <td>${prueba.prueba}</td>
                  <td>${prueba.resultado}</td>
                  <td>${prueba.indicador}</td>
              </tr>
              `).join("")}
          </table>
      </div>
  `).join("");


    htmlTemplate = htmlTemplate
      .replace(/{{full_name}}/g, patient.full_name)
      .replace(/{{date_birth}}/g, formatDate(patient.date_birth))
      .replace(/{{age}}/g, patient.age)
      .replace(/{{result}}/g, itemsHtml);

    // Generar PDF con Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlTemplate, { waitUntil: "load" });

    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    // Enviar PDF al cliente
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${patient.full_name}_${requestId}.pdf`);
    res.end(pdfBuffer);

    // Reemplazar los placeholders del template !!TODO: Reemplazar con los datos reales
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
