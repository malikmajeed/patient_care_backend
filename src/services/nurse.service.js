const { Op } = require("sequelize");
const Nurse = require("../models/nurse.model");
const nurseSchema = require("../schema/nurse.schema");
const { encryptPassword, comparePassword } = require("../utils/encrypt_password");
const { generateNurseId } = require("../utils/id_genrator");

// create nurse (signup)
const create = async (nurseData) => {
    try {
        const { error } = nurseSchema.createNurseSchema.validate(nurseData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        nurseData.nurse_ID = await generateNurseId();

        nurseData.password_hash = await encryptPassword(nurseData.password);
        delete nurseData.password;

        const nurse = await Nurse.create(nurseData);
        return nurse;
    } catch (error) {
        throw new Error(error.message);
    }
};

// login nurse with email
const login = async (nurseData) => {
    try {
        const { error } = nurseSchema.loginNurseSchema.validate(nurseData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const nurse = await Nurse.findOne({
            where: {
                email: nurseData.email
            }
        });

        if (!nurse) {
            throw new Error("Invalid email or password");
        }

        const isMatch = await comparePassword(nurseData.password, nurse.password_hash);

        if (!isMatch) {
            throw new Error("Invalid email or password");
        }

        return nurse;
    } catch (error) {
        throw new Error(error.message);
    }
};

// update nurse data
const update = async (nurseId, nurseData) => {
    try {
        const { error } = nurseSchema.updateNurseSchema.validate(nurseData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const nurse = await Nurse.findByPk(nurseId);
        if (!nurse) {
            throw new Error("Nurse not found");
        }

        if (nurseData.password) {
            nurseData.password_hash = await encryptPassword(nurseData.password);
            delete nurseData.password;
        }

        await Nurse.update(nurseData, {
            where: { nurse_ID: nurseId }
        });

        const updated = await Nurse.findByPk(nurseId);
        return updated;
    } catch (error) {
        throw new Error(error.message);
    }
};

// get a single nurse
const getById = async (nurseId) => {
    try {
        const nurse = await Nurse.findByPk(nurseId);
        if (!nurse) {
            throw new Error("Nurse not found");
        }
        return nurse;
    } catch (error) {
        throw new Error(error.message);
    }
};

// get all nurses
const getAll = async () => {
    try {
        const nurses = await Nurse.findAll();
        return nurses;
    } catch (error) {
        throw new Error(error.message);
    }
};

// delete nurse
const remove = async (nurseId) => {
    try {
        const deleted = await Nurse.destroy({ where: { nurse_ID: nurseId } });
        if (!deleted) {
            throw new Error("Nurse not found");
        }
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    create,
    login,
    update,
    getById,
    getAll,
    remove
};


