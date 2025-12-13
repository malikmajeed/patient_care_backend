const { Op } = require("sequelize");
const Patient = require("../models/patient.model");
const User = require("../models/user.model");
const patientSchema = require("../schema/patient.schema");
const userSchema = require("../schema/user.schema");
const { encryptPassword, comparePassword } = require("../utils/encrypt_password.utils");
const { generatePatientId, generateUserId } = require("../utils/id_genrator.utils");

// create patient
// create patient
const { db } = require("../database");

const create = async (patientData) => {
    const t = await db.transaction();
    try {
        const { error: userError } = userSchema.createUserSchema.validate(patientData);
        if (userError) {
            throw new Error(userError.details[0].message);
        }


        const isUserExist = await User.findOne({
            where: {
                [Op.or]: [
                    { username: patientData.username },
                    { email: patientData.email }
                ]
            }
        });

        if (isUserExist) {
            throw new Error("User with this username or email already exists");
        }


        const userId = await generateUserId();
        const hashedPassword = await encryptPassword(patientData.password);
        // Create User
        const user = await User.create({
            user_ID: userId,
            username: patientData.username,
            email: patientData.email,
            password_hash: hashedPassword,
            first_name: patientData.first_name,
            last_name: patientData.last_name,
            gender: patientData.gender,
            phone_number: patientData.phone_number,
            profile_url: patientData.profile_url,
            role: 'patient',
            is_verified: true
        }, { transaction: t });


        patientData.patient_ID = await generatePatientId();

        // Before deleting fields, we need to extract them for return or validation if needed.
        // But validation creates a new object if we check schema properly? 
        // We modified patientData directly.

        // Re-validate strictly for Patient parts if needed, but we already validated common user parts.
        // patient_ID is required in createPatientSchema.
        // We should construct a new object for validation to avoid mutating the original before we are done with it.
        const patientPayload = {
            ...patientData
        };

        const { error } = patientSchema.createPatientSchema.validate(patientPayload);
        if (error) {
            throw new Error(error.details[0].message);
        }

        // Prepare object for Patient Table
        // Only keep fields that belong to PATIENT table
        const patientTableData = {
            patient_ID: patientData.patient_ID,
            user_ID: userId,
            address: patientData.address,
            latitude: patientData.latitude,
            longitude: patientData.longitude
        };

        const patient = await Patient.create(patientTableData, { transaction: t });

        await t.commit();

        return {
            ...patient.toJSON(),
            email: user.email,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            gender: user.gender,
            phone_number: user.phone_number,
            profile_url: user.profile_url,
            role: 'patient'
        };
    } catch (error) {
        await t.rollback();
        console.error("Error creating patient:", error);
        // Clean up error message
        const message = error.original?.message || error.message || "Validation error";
        throw new Error(message);
    }
}

// login patient with username or email
// login patient with username or email
const login = async (patientData) => {
    try {
        const { error } = patientSchema.loginPatientSchema.validate(patientData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { username: patientData.username },
                    { email: patientData.username }
                ]
            }
        });

        if (!user) {
            throw new Error("Invalid username or password");
        }

        const isMatch = await comparePassword(patientData.password, user.password_hash);

        if (!isMatch) {
            throw new Error("Invalid username or password");
        }

        const patient = await Patient.findOne({
            where: { user_ID: user.user_ID }
        });

        if (!patient) {
            throw new Error("Patient profile not found");
        }

        return {
            ...patient.toJSON(),
            email: user.email,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            gender: user.gender,
            phone_number: user.phone_number,
            profile_url: user.profile_url,
            user_ID: user.user_ID
        };
    } catch (error) {
        throw new Error(error.message);
    }
}

// update patient data
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

        const updatesToUser = {};
        if (patientData.password) {
            updatesToUser.password_hash = await encryptPassword(patientData.password);
            delete patientData.password;
        }
        if (patientData.email) {
            updatesToUser.email = patientData.email;
            delete patientData.email;
        }
        if (patientData.username) {
            updatesToUser.username = patientData.username;
            delete patientData.username;
        }
        if (patientData.first_name) {
            updatesToUser.first_name = patientData.first_name;
            delete patientData.first_name;
        }
        if (patientData.last_name) {
            updatesToUser.last_name = patientData.last_name;
            delete patientData.last_name;
        }
        if (patientData.gender) {
            updatesToUser.gender = patientData.gender;
            delete patientData.gender;
        }
        if (patientData.phone_number) {
            updatesToUser.phone_number = patientData.phone_number;
            delete patientData.phone_number;
        }
        if (patientData.profile_url !== undefined) {
            updatesToUser.profile_url = patientData.profile_url;
            delete patientData.profile_url;
        }

        if (Object.keys(updatesToUser).length > 0) {
            await User.update(updatesToUser, { where: { user_ID: patient.user_ID } });
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
            include: [{
                model: User,
                attributes: ['email', 'username', 'first_name', 'last_name', 'gender', 'phone_number', 'profile_url', 'is_verified', 'is_active']
            }]
        });

        return patients.map(patient => {
            const json = patient.toJSON();
            if (json.USER) {
                json.email = json.USER.email;
                json.username = json.USER.username;
                json.first_name = json.USER.first_name;
                json.last_name = json.USER.last_name;
                json.gender = json.USER.gender;
                json.phone_number = json.USER.phone_number;
                json.profile_url = json.USER.profile_url;
                json.is_verified = json.USER.is_verified;
                json.is_active = json.USER.is_active;
                delete json.USER;
            }
            return json;
        });
    } catch (error) {
        throw new Error(error.message);
    }
}

// get patient by id
const getById = async (patientId) => {
    try {
        const patient = await Patient.findOne({ where: { user_ID: patientId } }, {
            include: [{
                model: User,
                attributes: ['email', 'username', 'first_name', 'last_name', 'gender', 'phone_number', 'profile_url', 'is_verified', 'is_active']
            }]
        });
        if (!patient) {
            throw new Error("Patient not found");
        }

        const json = patient.toJSON();
        if (json.USER) {
            json.email = json.USER.email;
            json.username = json.USER.username;
            json.first_name = json.USER.first_name;
            json.last_name = json.USER.last_name;
            json.gender = json.USER.gender;
            json.phone_number = json.USER.phone_number;
            json.profile_url = json.USER.profile_url;
            json.is_verified = json.USER.is_verified;
            json.is_active = json.USER.is_active;
            delete json.USER;
        }
        return json;
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