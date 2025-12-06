const Admin = require("../models/admin.model");
const Patient = require("../models/patient.model");
const Nurse = require("../models/nurse.model");

const generateId = async (model, prefix, idField) => {
    try {
        const lastRecord = await model.findOne({
            order: [[idField, 'DESC']],
            attributes: [idField]
        });

        if (!lastRecord) {
            return `${prefix}0001`;
        }

        const lastId = lastRecord[idField];
        const numericPartString = lastId.substring(2);
        const numericPart = parseInt(numericPartString, 10);

        if (isNaN(numericPart)) {
            return `${prefix}0001`;
        }

        const nextNumericPart = numericPart + 1;

        if (nextNumericPart > 9999) {
            throw new Error(`ID limit reached for prefix ${prefix}`);
        }

        return `${prefix}${nextNumericPart.toString().padStart(4, '0')}`;
    } catch (error) {
        throw new Error(`Error generating ID for ${prefix}: ${error.message}`);
    }
};

const generateAdminId = async () => {
    return await generateId(Admin, 'AD', 'admin_ID');
};

const generatePatientId = async () => {
    return await generateId(Patient, 'PT', 'patient_ID');
};

const generateNurseId = async () => {
    return await generateId(Nurse, 'NR', 'nurse_ID');
};

module.exports = {
    generateAdminId,
    generatePatientId,
    generateNurseId
};
