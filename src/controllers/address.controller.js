const addressService = require("../services/address.service");

const create = async (req, res) => {
    try {
        const address = await addressService.create(req.body);
        res.status(201).json({
            success: true,
            message: "Address created successfully",
            address
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

const getByPatientId = async (req, res) => {
    try {
        const { patientId } = req.params;
        const addresses = await addressService.getByPatientId(patientId);
        res.status(200).json({
            success: true,
            addresses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const getById = async (req, res) => {
    try {
        const address = await addressService.getById(req.params.id);
        res.status(200).json({
            success: true,
            address
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            error: error.message
        });
    }
};

const update = async (req, res) => {
    try {
        const address = await addressService.update(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Address updated successfully",
            address
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

const setDefault = async (req, res) => {
    try {
        const address = await addressService.setDefault(req.params.id);
        res.status(200).json({
            success: true,
            message: "Default address set successfully",
            address
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

const remove = async (req, res) => {
    try {
        await addressService.remove(req.params.id);
        res.status(200).json({
            success: true,
            message: "Address deleted successfully"
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            error: error.message
        });
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
