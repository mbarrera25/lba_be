// queries.js

const getRequestsQuery = `
  SELECT 
    r.id AS request_id, 
    r.date, 
    r.observation, 
    r.status, 
    r.sub_total, 
    r."createdAt" AS request_createdAt, 
    r."updatedAt" AS request_updatedAt, 
    r.patient_id,
    i.id AS invoice_id, 
    i.date_at AS invoice_date_at, 
    i.name AS invoice_name, 
    i.identification AS invoice_identification, 
    i.type_person AS invoice_type_person, 
    i.direction AS invoice_direction, 
    i.invoice_number AS invoice_invoice_number,
    i.total_amount AS invoice_total_amount, 
    i.subtotal_amount AS invoice_subtotal_amount, 
    i.igtf AS invoice_igtf, 
    i.rate AS invoice_rate, 
    i."createdAt" AS invoice_createdAt, 
    i."updatedAt" AS invoice_updatedAt, 
    i.request_id AS invoice_request_id, 
    i.currency_id AS invoice_currency_id,
    i.pay_method AS pay_method,
    p.id AS patient_id, 
    p.full_name AS patient_full_name, 
    p.date_birth AS patient_date_birth, 
    p.gender AS patient_gender, 
    p.identification AS patient_identification, 
    p.email AS patient_email, 
    p.phone AS patient_phone, 
    p.address AS patient_address, 
    p.blood_type AS patient_blood_type, 
    p.medical_history AS patient_medical_history, 
    p.allergies AS patient_allergies, 
    p."createdAt" AS patient_createdAt, 
    p."updatedAt" AS patient_updatedAt
  FROM public.requests r
  LEFT JOIN public.invoices i ON i.request_id = r.id
  LEFT JOIN public.patient p ON p.id = r.patient_id
  LIMIT :limit OFFSET :offset;
`;

const getAnalysisQuery = `
  SELECT 
    a.id, 
    a.code, 
    a.name, 
    a.description, 
    a.price, 
    a.currency, 
    a.date, 
    a."createdAt", 
    a."updatedAt" 
  FROM public.analysis a
  LEFT JOIN public.request_analysis ra ON ra.analysis_id = a.id 
  LEFT JOIN public.requests r ON r.id = ra.request_id
  WHERE r.id = :request_id;
`;

const getInvoiceDetailsQuery = `
  SELECT 
    id, 
    quantity, 
    description, 
    price, 
    total, 
    rate, 
    "createdAt", 
    "updatedAt", 
    invoice_id
  FROM public.invoice_detail inv_det
  WHERE inv_det.invoice_id = :invoice_id;
`;

const getResultPatient = `
select
	a.name as analisis,
	td."name" as prueba,
	rp.valor as resultado,
	td."indicator" as indicador,
	p.full_name as patient,
	p.date_birth 
FROM requests r
INNER JOIN result_patient rp ON rp.request_id = r.id
inner join test_detail td on td.id  = rp.test_detail_id 
inner join analysis_test at2 on at2.test_id = td.test_id 
inner join request_analysis ra on ra.analysis_id = at2.analysis_id and ra.request_id = r.id
inner join analysis a on a.id = at2.analysis_id 
INNER JOIN patient p ON r.patient_id = p.id
where
	r.id = :request_id order by analisis;
`;

module.exports = {
  getRequestsQuery,
  getAnalysisQuery,
  getInvoiceDetailsQuery,
  getResultPatient
};
