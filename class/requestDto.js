const InvoiceDto = require('./InvoiceDto');
const PatientDto = require('./PatientDto');
const AnalysisDto = require('./AnalysisDto');

class RequestResponseDto {
    invoice;
    patient;
    analysis = [];

    constructor(
      request_id, 
      date, 
      observation, 
      status, 
      sub_total, 
      request_createdAt, 
      request_updatedAt, 
      patient_id, 
      patient_full_name, 
      patient_date_birth, 
      patient_gender, 
      patient_identification, 
      patient_email, 
      patient_phone, 
      patient_address, 
      patient_blood_type, 
      patient_medical_history, 
      patient_allergies, 
      patient_createdAt, 
      patient_updatedAt,
      invoice_id, 
      invoice_date_at, 
      invoice_name, 
      invoice_identification, 
      invoice_type_person, 
      invoice_direction, 
      invoice_invoice_number, 
      invoice_total_amount, 
      invoice_subtotal_amount, 
      invoice_igtf, 
      invoice_rate, 
      invoice_createdAt, 
      invoice_updatedAt, 
      invoice_request_id, 
      invoice_currency_id,
      invoiceLines,
      analysis
    ) {
      // Datos de la solicitud (request)
      this.id = request_id;
      this.date = date;
      this.observation = observation;
      this.status = status;
      this.sub_total = sub_total;
      this.createdAt = request_createdAt;
      this.updatedAt = request_updatedAt;

      // Datos del paciente (patient)
      this.patient = new PatientDto(
        patient_id, 
        patient_full_name, 
        patient_date_birth, 
        patient_gender, 
        patient_identification, 
        patient_email, 
        patient_phone, 
        patient_address, 
        patient_blood_type, 
        patient_medical_history, 
        patient_allergies, 
        patient_createdAt, 
        patient_updatedAt
      );

            // Datos de la factura (invoice)
      this.invoice = invoice_id ? new InvoiceDto(
        invoice_id, 
        invoice_date_at, 
        invoice_name, 
        invoice_identification, 
        invoice_type_person, 
        invoice_direction, 
        invoice_invoice_number, 
        invoice_total_amount, 
        invoice_subtotal_amount, 
        invoice_igtf, 
        invoice_rate, 
        invoice_createdAt, 
        invoice_updatedAt, 
        invoice_request_id, 
        invoice_currency_id,
        invoiceLines
      ) : null;
      // Datos del análisis (analysis)
      this.analysis = analysis ? analysis.map(item => new AnalysisDto(
        item.id,
        item.code,
        item.name,
        item.description,
        item.price,
        item.currency,
        item.date,
        item.createdAt,
        item.updatedAt
      )) : [];
    }

    // Método estático para mapear la respuesta de la consulta
    static fromRow(item) {
        return new RequestResponseDto(
          item.request_id,
          item.date,
          item.observation,
          item.status,
          item.sub_total,
          item.request_createdAt,
          item.request_updatedAt,
          item.patient_id,
          item.patient_full_name,
          item.patient_date_birth,
          item.patient_gender,
          item.patient_identification,
          item.patient_email,
          item.patient_phone,
          item.patient_address,
          item.patient_blood_type,
          item.patient_medical_history,
          item.patient_allergies,
          item.patient_createdAt,
          item.patient_updatedAt,
          item.invoice_id,
          item.invoice_date_at,
          item.invoice_name,
          item.invoice_identification,
          item.invoice_type_person,
          item.invoice_direction,
          item.invoice_invoice_number,
          item.invoice_total_amount,
          item.invoice_subtotal_amount,
          item.invoice_igtf,
          item.invoice_rate,
          item.invoice_createdAt,
          item.invoice_updatedAt,
          item.invoice_request_id,
          item.invoice_currency_id,
          item.analysis
        );
    }
}

module.exports = RequestResponseDto;
