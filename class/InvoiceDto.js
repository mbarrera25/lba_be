const InvoiceLineDto = require('./InvoiceDetailDto')
class InvoiceDto {
  constructor(
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
      invoice_line,
      pay_method
  ) {
    this.invoice_id = invoice_id;
      this.date_at = invoice_date_at;
      this.name = invoice_name;
      this.identification = invoice_identification;
      this.type_person = invoice_type_person;
      this.direction = invoice_direction;
      this.invoice_number = invoice_invoice_number;
      this.total_amount = invoice_total_amount;
      this.subtotal_amount = invoice_subtotal_amount;
      this.igtf = invoice_igtf;
      this.rate = invoice_rate;
      this.createdAt = invoice_createdAt;
      this.updatedAt = invoice_updatedAt;
      this.request_id = invoice_request_id;
      this.currency_id = invoice_currency_id;
      this.pay_method = pay_method;
      this.invoice_line = invoice_line.map((line) => 
        new InvoiceLineDto(
        line.id,
        line.quantity,
        line.description,
        line.price,
        line.total,
        line.rate,
        line.createdAt,
        line.updatedAt,
        line.invoice_id
      ));
  }
}

module.exports = InvoiceDto;
