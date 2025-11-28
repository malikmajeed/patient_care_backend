const PatientService = require("../services/patient.service");


// Create a new patient
const signup = async (req, res) => {
    try {

        const userData = req.body;

        const result = await PatientService.create(userData);
        return res.status(201).json({
            message: "Patient created successfully",
            result
        })

    } catch (error) {
        return res.status(500).json({
            message: "Failed to create patient",
            error: error.message
        })
    }
}



const PatientController = {
    signup
};

module.exports = PatientController;