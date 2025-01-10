class AnalysisDto {
    constructor(
      id, 
      code, 
      name, 
      description, 
      price, 
      currency, 
      date, 
      createdAt, 
      updatedAt
    ) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.description = description;
        this.price = price;
        this.currency = currency;
        this.date = date;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

module.exports = AnalysisDto;  // Exportación correcta
