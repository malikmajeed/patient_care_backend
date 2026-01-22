const { Op } = require("sequelize");
const PatientAddress = require("../models/patient_address.model");
const addressSchema = require("../schema/address.schema");

// create address
const create = async (addressData) => {
    try {
        const { error } = addressSchema.createAddressSchema.validate(addressData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        // If this is set as default, unset other default addresses
        if (addressData.is_default) {
            await PatientAddress.update(
                { is_default: false },
                { where: { patient_ID: addressData.patient_ID } }
            );
        }

        const address = await PatientAddress.create(addressData);
        return address;
    } catch (error) {
        throw new Error(error.message);
    }
};

// get all addresses for a patient
const getByPatientId = async (patientId) => {
    try {
        const addresses = await PatientAddress.findAll({
            where: { patient_ID: patientId },
            order: [
                ['is_default', 'DESC'],
                ['createdAt', 'DESC']
            ]
        });
        return addresses;
    } catch (error) {
        throw new Error(error.message);
    }
};

// get address by id
const getById = async (addressId) => {
    try {
        const address = await PatientAddress.findByPk(addressId);
        if (!address) {
            throw new Error("Address not found");
        }
        return address;
    } catch (error) {
        throw new Error(error.message);
    }
};

// update address
const update = async (addressId, addressData) => {
    try {
        const { error } = addressSchema.updateAddressSchema.validate(addressData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const address = await PatientAddress.findByPk(addressId);
        if (!address) {
            throw new Error("Address not found");
        }

        // If setting as default, unset other default addresses
        if (addressData.is_default) {
            await PatientAddress.update(
                { is_default: false },
                { 
                    where: { 
                        patient_ID: address.patient_ID,
                        address_ID: { [Op.ne]: addressId }
                    } 
                }
            );
        }

        await PatientAddress.update(addressData, {
            where: { address_ID: addressId }
        });

        const updated = await PatientAddress.findByPk(addressId);
        return updated;
    } catch (error) {
        throw new Error(error.message);
    }
};

// set default address
const setDefault = async (addressId) => {
    try {
        const address = await PatientAddress.findByPk(addressId);
        if (!address) {
            throw new Error("Address not found");
        }

        // Unset all other default addresses for this patient
        await PatientAddress.update(
            { is_default: false },
            { 
                where: { 
                    patient_ID: address.patient_ID,
                    address_ID: { [Op.ne]: addressId }
                } 
            }
        );

        // Set this address as default
        await PatientAddress.update(
            { is_default: true },
            { where: { address_ID: addressId } }
        );

        const updated = await PatientAddress.findByPk(addressId);
        return updated;
    } catch (error) {
        throw new Error(error.message);
    }
};

// delete address
const remove = async (addressId) => {
    try {
        const deleted = await PatientAddress.destroy({
            where: { address_ID: addressId }
        });
        if (!deleted) {
            throw new Error("Address not found");
        }
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    create,
    getByPatientId,
    getById,
    update,
    setDefault,
    remove
};
