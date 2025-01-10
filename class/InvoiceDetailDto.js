
class InvoiceLineDto {
    constructor(
      id,
      quantity,
      description,
      price,
      total,
      rate,
      createdAt,
      updatedAt,
      invoice_id
    ) {
      this.id = id;
      this.quantity = quantity;
      this.description = description;
      this.price = price;
      this.total = total;
      this.rate = rate;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      this.invoice_id = invoice_id;
    }
  }
  
  module.exports = InvoiceLineDto;  