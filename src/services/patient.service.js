const { Op } = require("sequelize");
const Patient = require("../models/patient.model");
const patientSchema = require("../schema/patient.schema");
const { encryptPassword, comparePassword } = require("../utils/encrypt_password.utils");
const { generatePatientId } = require("../utils/id_genrator.utils");

// create patient
const create = async (patientData) => {
    try {
        const { error } = patientSchema.createPatientSchema.validate(patientData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const isPatientExist = await Patient.findOne({
            where: {
                [Op.or]: [
                    { username: patientData.username },
                    { email: patientData.username }
                ]
            }
        });

        if (isPatientExist) {
            throw new Error("Patient already exists");
        }

        patientData.patient_ID = await generatePatientId();

        patientData.password = await encryptPassword(patientData.password);

        const patient = await Patient.create(patientData);
        return patient;
    } catch (error) {
        throw new Error(error.message);
    }
}

// login patient with username or email
const login = async (patientData) => {
    try {
        const { error } = patientSchema.loginPatientSchema.validate(patientData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const patient = await Patient.findOne({
            where: {
                [Op.or]: [
                    { username: patientData.username },
                    { email: patientData.username }
                ]
            }
        });

        if (!patient) {
            throw new Error("Invalid email or password");
        }

        const isMatch = await comparePassword(patientData.password, patient.password);

        if (!isMatch) {
            throw new Error("Invalid email or password");
        }

        return patient;

    } catch (error) {
        throw new Error(error.message);
    }
}

// update patient data
const update = async (patientId, patientData) => {
    try {
        const { error } = patientSchema.updatePatientSchema.validate(patientData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const patient = await Patient.findByPk(patientId);
        if (!patient) {
            throw new Error("Patient not found");
        }

        if (patientData.password) {
            patientData.password = await encryptPassword(patientData.password);
        }

        const updatedPatient = await Patient.update(patientData, {
            where: {
                patient_ID: patientId
            }
        });

        return updatedPatient;
    } catch (error) {
        throw new Error(error.message);
    }
}

// get all patients
const getAll = async () => {
    try {
        const patients = await Patient.findAll({
            attributes: { exclude: ['password'] }
        });
        return patients;
    } catch (error) {
        throw new Error(error.message);
    }
}

// get patient by id
const getById = async (patientId) => {
    try {
        const patient = await Patient.findByPk(patientId, {
            attributes: { exclude: ['password'] }
        });
        if (!patient) {
            throw new Error("Patient not found");
        }
        return patient;
    } catch (error) {
        throw new Error(error.message);
    }
}

// delete patient
const deletePatient = async (patientId) => {
    try {
        const patient = await Patient.findByPk(patientId);
        if (!patient) {
            throw new Error("Patient not found");
        }

        await Patient.destroy({
            where: {
                patient_ID: patientId
            }
        });

        return { message: "Patient deleted successfully" };
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    create,
    login,
    update,
    getAll,
    getById,
    deletePatient
};