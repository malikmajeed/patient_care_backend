const Payment = require("../models/payment.model");
const paymentSchema = require("../schema/payment.schema");
const { generatePaymentId } = require("../utils/uuid_generator.utils");

// create payment
const create = async (paymentData) => {
    try {
        const { error } = paymentSchema.createPaymentSchema.validate(paymentData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        // Generate unique payment ID
        const payment_ID = await generatePaymentId();

        const payment = await Payment.create({
            payment_ID,
            ...paymentData
        });
        return payment;
    } catch (error) {
        throw new Error(error.message);
    }
};

// get all payments
const getAll = async () => {
    try {
        const payments = await Payment.findAll();
        return payments;
    } catch (error) {
        throw new Error(error.message);
    }
};

// get payment by id
const getById = async (paymentId) => {
    try {
        const payment = await Payment.findByPk(paymentId);
        if (!payment) {
            throw new Error("Payment not found");
        }
        return payment;
    } catch (error) {
        throw new Error(error.message);
    }
};

// update payment
const update = async (paymentId, paymentData) => {
    try {
        const { error } = paymentSchema.updatePaymentSchema.validate(paymentData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const payment = await Payment.findByPk(paymentId);
        if (!payment) {
            throw new Error("Payment not found");
        }

        await Payment.update(paymentData, {
            where: { payment_ID: paymentId }
        });

        const updated = await Payment.findByPk(paymentId);
        return updated;
    } catch (error) {
        throw new Error(error.message);
    }
};

// delete payment
const remove = async (paymentId) => {
    try {
        const deleted = await Payment.destroy({
            where: { payment_ID: paymentId }
        });
        if (!deleted) {
            throw new Error("Payment not found");
        }
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove
};


