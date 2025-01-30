const router = require("express").Router();
const Test = require("../models/Test");
const TestDetail = require("../models/test_detail");
const Analysis = require("../models/Analysis");
const Requests = require("../models/Requests");
const RequestsAnalysis = require("../models/request_analysis");
const ResultPatient = require("../models/Result_patient");

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

module.exports = router;
