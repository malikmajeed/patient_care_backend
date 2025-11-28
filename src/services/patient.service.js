const Patient = require("../models/patient.model");
const { createPatientSchema } = require("../schema/patient.schema");



const create = async (userData) => {
    try {
        const { error, value } = createPatientSchema.validate(userData);

        if (error) {
            throw new Error(error.details[0].message);
        }

        //temporary patient ID generation function
        const generatePatientId = () => {
            const randomNum = Math.floor(Math.random() * 10000)   // 0 to 9999
                .toString()
                .padStart(4, '0'); // ensures 4 digits

            return "PT" + randomNum;
        };

        value.patient_ID = generatePatientId();
        const patient = await Patient.create(value);
        return patient;
    } catch (error) {
        throw new Error(error.message);
    }
}




const PatientService = {
    create
};

module.exports = PatientService;