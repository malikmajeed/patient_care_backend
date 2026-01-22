const Payment = require("../models/payment.model");
const Booking = require("../models/booking.model");
const Patient = require("../models/patient.model");
const Nurse = require("../models/nurse.model");
const User = require("../models/user.model");
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

// initiate payment (for online payment gateways)
const initiatePayment = async (paymentData) => {
    try {
        const { booking_ID, payment_method, amount } = paymentData;

        // Validate booking exists
        const booking = await Booking.findByPk(booking_ID);
        if (!booking) {
            throw new Error('Booking not found');
        }

        // Generate payment ID
        const payment_ID = await generatePaymentId();

        // Create payment record with pending status
        const payment = await Payment.create({
            payment_ID,
            booking_ID,
            amount: parseFloat(amount),
            payment_method,
            transaction_date: new Date(),
            status: 'pending',
            transaction_details: JSON.stringify({
                gateway: payment_method,
                initiated_at: new Date().toISOString()
            })
        });

        // For JazzCash/EasyPaisa integration, this would:
        // 1. Call gateway API to initiate payment
        // 2. Get payment gateway URL
        // 3. Return URL to frontend for redirect

        // Placeholder for actual gateway integration
        let gatewayUrl = null;
        if (payment_method === 'jazzcash' || payment_method === 'easypaisa') {
            // In production, this would call the actual gateway API
            gatewayUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/payment/process?paymentId=${payment_ID}`;
        }

        return {
            payment,
            gateway_url: gatewayUrl,
            payment_id: payment_ID
        };
    } catch (error) {
        throw new Error(`Failed to initiate payment: ${error.message}`);
    }
};

// handle payment callback/webhook
const handlePaymentCallback = async (paymentId, callbackData) => {
    try {
        const payment = await Payment.findByPk(paymentId);
        if (!payment) {
            throw new Error('Payment not found');
        }

        // Verify payment with gateway (in production)
        // For now, we'll simulate verification
        const isVerified = callbackData.status === 'success' || callbackData.status === 'completed';

        // Update payment status
        await Payment.update(
            {
                status: isVerified ? 'successful' : 'failed',
                transaction_ID: callbackData.transaction_id || null,
                gateway_response: JSON.stringify(callbackData)
            },
            { where: { payment_ID: paymentId } }
        );

        // Update booking payment status if payment successful
        if (isVerified) {
            await Booking.update(
                { payment_status: 'paid' },
                { where: { booking_ID: payment.booking_ID } }
            );
        }

        const updated = await Payment.findByPk(paymentId);
        return updated;
    } catch (error) {
        throw new Error(`Failed to handle payment callback: ${error.message}`);
    }
};

// generate invoice PDF
const generateInvoice = async (paymentId) => {
    try {
        const payment = await Payment.findByPk(paymentId, {
            include: [
                {
                    model: Booking,
                    include: [
                        {
                            model: Patient,
                            include: [{ model: User, attributes: ['first_name', 'last_name', 'email'] }]
                        },
                        {
                            model: Nurse,
                            include: [{ model: User, attributes: ['first_name', 'last_name'] }]
                        }
                    ]
                }
            ]
        });

        if (!payment) {
            throw new Error('Payment not found');
        }

        // In production, use PDFKit or similar to generate PDF
        // For now, return invoice data
        const booking = payment.BOOKING;
        return {
            invoice_number: `INV-${payment.payment_ID}`,
            payment_ID: payment.payment_ID,
            booking_ID: payment.booking_ID,
            amount: payment.amount,
            payment_method: payment.payment_method,
            transaction_date: payment.transaction_date,
            status: payment.status,
            transaction_ID: payment.transaction_ID,
            booking: booking ? {
                booked_datetime: booking.booked_datetime,
                start_time: booking.start_time,
                end_time: booking.end_time,
                duration_hours: booking.duration_hours,
                patient: booking.PATIENT ? {
                    name: `${booking.PATIENT.USER?.first_name} ${booking.PATIENT.USER?.last_name}`,
                    email: booking.PATIENT.USER?.email
                } : null,
                nurse: booking.NURSE ? {
                    name: `${booking.NURSE.USER?.first_name} ${booking.NURSE.USER?.last_name}`
                } : null
            } : null
        };
    } catch (error) {
        throw new Error(`Failed to generate invoice: ${error.message}`);
    }
};

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove,
    initiatePayment,
    handlePaymentCallback,
    generateInvoice
};


