const router = require("express").Router();
const Analysis = require("../models/Analysis");
const Patient = require("../models/Patient");
const Requests = require("../models/Requests");
const Request_analysis = require("../models/request_analysis");
const sequelize = require("../config/database");
const RequestResponseDto = require("../class/requestDto");
const { getRequestsQuery, getAnalysisQuery, getInvoiceDetailsQuery } = require('./queries/queries'); // Importar las consultas


router.get("/patient/:patientId", async (req, res) => {
  try {
    // Obtener el id del paciente desde los parámetros de la URL
    const { patientId } = req.params;

    // Buscar los requests asociados con el paciente
    const requests = await Requests.findAll({
      where: { patient_id: patientId }, // Filtrar por el id del paciente
      include: [
        {
          model: Patient,
          as: "patient", // Incluye el paciente en la respuesta
        },
        {
          model: Analysis,
          as: "analysis", // Incluye los análisis relacionados
          through: {
            attributes: [], // Excluye los atributos de la tabla intermedia (request_analysis)
          },
          //attributes: ["id", "name", "fecha"], // Devuelve el id, nombre y fecha de cada análisis
        },
      ],
    });

    // Si no se encuentran solicitudes, respondemos con un error
    if (!requests.length) {
      return res
        .status(404)
        .json({ error: "No requests found for this patient" });
    }

    // Formatear la respuesta en la estructura solicitada
    console.log(requests);

    const analysis = requests.map((request) => {
      return {
        id: request.id,
        analysis: request.analysis,
        date: request.date,
        status: request.status,
      };
    });

    const response = {
      patient: requests[0].patient,
      analysis,
    };
    // Devolver la respuesta
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const { page, size } = req.query;
    const limit = size ? parseInt(size) : 10;
    const offset = (page ? parseInt(page) - 1 : 0) * limit;
  
    // Obtener las solicitudes
    const solicitudes = await sequelize.query(getRequestsQuery, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { limit, offset },
    });

    // Usar Promise.all() para esperar todas las consultas de análisis
    const response = await Promise.all(solicitudes.map(async (row) => {
      const analysis = await sequelize.query(getAnalysisQuery, { 
        type: sequelize.QueryTypes.SELECT,
        replacements: { request_id: row.request_id },
      });

        // Obtener las líneas de la factura asociadas a la factura
        const invoiceLines = await sequelize.query(getInvoiceDetailsQuery, { 
          type: sequelize.QueryTypes.SELECT,
          replacements: { invoice_id: row.invoice_id },
        });
        console.log(invoiceLines);
        
        return new RequestResponseDto(
          row.request_id,
          row.date,
          row.observation,
          row.status,
          row.sub_total,
          row.request_createdAt,
          row.request_updatedAt,
          row.patient_id,
          row.patient_full_name,
          row.patient_date_birth,
          row.patient_gender,
          row.patient_identification,
          row.patient_email,
          row.patient_phone,
          row.patient_address,
          row.patient_blood_type,
          row.patient_medical_history,
          row.patient_allergies,
          row.patient_createdAt,
          row.patient_updatedAt,
          row.invoice_id,
          row.invoice_date_at,
          row.invoice_name,
          row.invoice_identification,
          row.invoice_type_person,
          row.invoice_direction,
          row.invoice_invoice_number,
          row.invoice_total_amount,
          row.invoice_subtotal_amount,
          row.invoice_igtf,
          row.invoice_rate,
          row.invoice_createdAt,
          row.invoice_updatedAt,
          row.invoice_request_id,
          row.invoice_currency_id,
          invoiceLines,
          analysis // Ahora se coloca en la posición correcta
      );
      
    }));

    res.status(200).json(response); // Devuelve la respuesta con todas las solicitudes y sus análisis
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
          through: {
            // Esto excluye los atributos de la tabla intermedia
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
