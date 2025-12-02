const requiredServiceService = require("../services/required_service.service");

const create = async (req, res) => {
    try {
        const item = await requiredServiceService.create(req.body);
        res.status(201).json({
            success: true,
            message: "Required service link created successfully",
            item
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
        const items = await requiredServiceService.getAll();
        res.status(200).json({
            success: true,
            items
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
        const item = await requiredServiceService.getById(req.params.reqId, req.params.categoryId);
        res.status(200).json({
            success: true,
            item
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
        const item = await requiredServiceService.update(req.params.reqId, req.params.categoryId, req.body);
        res.status(200).json({
            success: true,
            message: "Required service link updated successfully",
            item
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
        await requiredServiceService.remove(req.params.reqId, req.params.categoryId);
        res.status(200).json({
            success: true,
            message: "Required service link deleted successfully"
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


