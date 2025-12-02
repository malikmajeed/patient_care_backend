const paymentService = require("../services/payment.service");

const create = async (req, res) => {
    try {
        const payment = await paymentService.create(req.body);
        res.status(201).json({
            success: true,
            message: "Payment created successfully",
            payment
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
        const payments = await paymentService.getAll();
        res.status(200).json({
            success: true,
            payments
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
        const payment = await paymentService.getById(req.params.id);
        res.status(200).json({
            success: true,
            payment
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
        const payment = await paymentService.update(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Payment updated successfully",
            payment
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
        await paymentService.remove(req.params.id);
        res.status(200).json({
            success: true,
            message: "Payment deleted successfully"
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


