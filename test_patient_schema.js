const { createPatientSchema } = require('./src/schema/patient.schema');

const validPatient = {
    first_name: "John",
    last_name: "Doe",
    gender: "male",
    email: "john.doe@example.com",
    password: "password123",
    phone_number: "1234567890"
};

const { error } = createPatientSchema.validate(validPatient);
if (error) {
    console.error("Validation failed:", error.details);
    process.exit(1);
} else {
    console.log("Validation successful!");
}
