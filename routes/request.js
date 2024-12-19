const router = require("express").Router();
const Analysis = require("../models/analysis");
const Patient = require("../models/patient");
const Requests = require("../models/Requests");
const Request_analysis = require("../models/request_analysis");
router.get("/", async (req, res) => {
  try {    
    const { page, size } = req.query;
    const limit = size ? parseInt(size) : 10;
    const offset = (page ? parseInt(page) - 1 : 0) * limit;

    const solicitud = await Requests.findAll({
      limit,
      offset,
      include: [
        {
          model: Patient,
          as: "patient",
        },
        {
          model: Analysis,
          as: "analysis",
          through: {// Esto excluye los atributos de la tabla intermedia
            attributes: [],
          }, 
        },
      ],
    });    
    res.status(200).json(solicitud);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    
    const solicitud = await Requests.create(req.body);

    // Crear la relación en la tabla de unión
    const relations = req.body.analysis.map(async (a) => {
      console.log(a);
      
      await Request_analysis.create({
        request_id: solicitud.id,
        analysis_id: a,
      });
    });
    await Promise.all(relations);
    res.status(201).json(solicitud);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
    try {
        const solicitud = await Requests.findByPk(req.params.id, {
        include: [
            {
            model: Patient,
            as: "paciente",
            },
        ],
        include: [
            {
            model: Analysis,
            as: "analisis",
            through: {// Esto excluye los atributos de la tabla intermedia
                attributes: [],
            },
            },
        ],
        });
        if (solicitud) {
        res.status(200).json(solicitud);
        } else {
        res.status(404).json({ error: "Solicitud not found" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    }); 

    router.put("/:id", async (req, res) => {
        try {
          const [updated] = await Requests.update(req.body, {
            where: { id: req.params.id },
          });
          if (updated) {
            const updatedSolicitud = await Requests.findByPk(req.params.id);
            res.status(200).json(updatedSolicitud);
          } else {
            res.status(404).json({ error: "Solicitud not found" });
          }
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      });

      router.delete("/:id", async (req, res) => {
        try {
          const deleted = await Requests.destroy({
            where: { id: req.params.id },
          });
          if (deleted) {
            res.status(204).json();
          } else {
            res.status(404).json({ error: "Solicitud not found" });
          }
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      });

      router.patch("/:id/status", async (req, res) => {
        try {
          const { status } = req.body; // Se espera que el nuevo status venga en el body
          if (!status) {
            return res.status(400).json({ error: "Status is required" });
          }
      
          const solicitud = await Requests.findByPk(req.params.id);
          if (!solicitud) {
            return res.status(404).json({ error: "Solicitud not found" });
          }
      
          solicitud.status = status; // Actualizamos el campo status
          await solicitud.save(); // Guardamos los cambios
      
          res.status(200).json({ message: "Status updated successfully", solicitud });
        } catch (error) {
          res.status(400).json({ error: error.message });
        }
      });

      module.exports = router;