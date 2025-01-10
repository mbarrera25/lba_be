class PatientDto {
    constructor(
      patient_id, 
      full_name, 
      date_birth, 
      gender, 
      identification, 
      email, 
      phone, 
      address, 
      blood_type, 
      medical_history, 
      allergies, 
      createdAt, 
      updatedAt
    ) {
        this.id = patient_id;
        this.full_name = full_name;
        this.date_birth = date_birth;
        this.gender = gender;
        this.identification = identification;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.blood_type = blood_type;
        this.medical_history = medical_history;
        this.allergies = allergies;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

module.exports = PatientDto;
