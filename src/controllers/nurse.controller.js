
const nurseService = require("../services/nurse.service");
const availabilityService = require("../services/availability.service");

const getAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                success: false,
                error: 'Date parameter is required (format: YYYY-MM-DD)'
            });
        }

        const availability = await availabilityService.getAvailability(id, date);
        res.status(200).json({
            success: true,
            ...availability
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const searchNurses = async (req, res) => {
    try {
        const result = await nurseService.searchNurses(req.query);
        res.status(200).json({
            success: true,
            ...result
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

const updateVerificationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const nurse = await nurseService.updateVerificationStatus(id, req.body);
        res.status(200).json({
            success: true,
            message: "Verification status updated successfully",
            nurse
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    searchNurses,
    getAvailability,
    update,
    updateVerificationStatus,
    getById,
    getAll,
    remove
};


