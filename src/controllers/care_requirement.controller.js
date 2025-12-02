const careRequirementService = require("../services/care_requirement.service");

const create = async (req, res) => {
    try {
        const requirement = await careRequirementService.create(req.body);
        res.status(201).json({
            success: true,
            message: "Care requirement created successfully",
            requirement
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

const getAll = async (req, res) => {
    try {
        const requirements = await careRequirementService.getAll();
        res.status(200).json({
            success: true,
            requirements
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
        const requirement = await careRequirementService.getById(req.params.id);
        res.status(200).json({
            success: true,
            requirement
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
        const requirement = await careRequirementService.update(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Care requirement updated successfully",
            requirement
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
        await careRequirementService.remove(req.params.id);
        res.status(200).json({
            success: true,
            message: "Care requirement deleted successfully"
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
    getAll,
    getById,
    update,
    remove
};


