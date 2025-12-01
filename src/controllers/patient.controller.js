const patientService = require("../services/patient.service");


const signup = async (req, res) => {
    try {
        const patient = await patientService.create(req.body);
        res.status(201).json({
            success: true,
            message: "Patient created successfully",
            patient
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}


const login = async (req, res) => {

    try {
        const patient = await patientService.login(req.body);


        res.status(200).json({
            success: true,
            message: "Patient logged in successfully",
            patient
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}


const update = async (req, res) => {
    try {
        const patient = await patientService.update(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Patient updated successfully",
            patient
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}



const patientController = {
    signup,
    login,
    update
};

module.exports = patientController;