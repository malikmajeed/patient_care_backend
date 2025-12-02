const serviceCategoryService = require("../services/service_category.service");

const create = async (req, res) => {
    try {
        const category = await serviceCategoryService.create(req.body);
        res.status(201).json({
            success: true,
            message: "Service category created successfully",
            category
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
        const categories = await serviceCategoryService.getAll();
        res.status(200).json({
            success: true,
            categories
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
        const category = await serviceCategoryService.getById(req.params.id);
        res.status(200).json({
            success: true,
            category
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
        const category = await serviceCategoryService.update(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Service category updated successfully",
            category
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
        await serviceCategoryService.remove(req.params.id);
        res.status(200).json({
            success: true,
            message: "Service category deleted successfully"
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


