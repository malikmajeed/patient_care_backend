const documentService = require("../services/document.service");

const create = async (req, res) => {
    try {
        const document = await documentService.create(req.body);
        res.status(201).json({
            success: true,
            message: "Document created successfully",
            document
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
        const documents = await documentService.getAll();
        res.status(200).json({
            success: true,
            documents
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
        const document = await documentService.getById(req.params.id);
        res.status(200).json({
            success: true,
            document
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
        const document = await documentService.update(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Document updated successfully",
            document
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
        await documentService.remove(req.params.id);
        res.status(200).json({
            success: true,
            message: "Document deleted successfully"
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


