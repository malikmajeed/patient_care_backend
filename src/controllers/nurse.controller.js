
const nurseService = require("../services/nurse.service");

const signup = async (req, res) => {
    try {
        const nurse = await nurseService.create(req.body);
        res.status(201).json({
            success: true,
            message: "Nurse created successfully",
            nurse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const nurse = await nurseService.login(req.body);
        res.status(200).json({
            success: true,
            message: "Nurse logged in successfully",
            nurse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const update = async (req, res) => {
    try {
        const nurse = await nurseService.update(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Nurse updated successfully",
            nurse
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
        const nurse = await nurseService.getById(req.params.id);
        res.status(200).json({
            success: true,
            nurse
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            error: error.message
        });
    }
};

const getAll = async (req, res) => {
    try {
        const nurses = await nurseService.getAll();
        res.status(200).json({
            success: true,
            nurses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const remove = async (req, res) => {
    try {
        await nurseService.remove(req.params.id);
        res.status(200).json({
            success: true,
            message: "Nurse deleted successfully"
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    signup,
    login,
    update,
    getById,
    getAll,
    remove
};


