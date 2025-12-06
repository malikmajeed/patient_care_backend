const Booking = require("../models/booking.model");
const bookingSchema = require("../schema/booking.schema");
const { generateBookingId } = require("../utils/uuid_generator.utils");

// create booking
const create = async (bookingData) => {
    try {
        const { error } = bookingSchema.createBookingSchema.validate(bookingData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        // Generate unique booking ID
        const booking_ID = await generateBookingId();

        const booking = await Booking.create({
            booking_ID,
            ...bookingData
        });
        return booking;
    } catch (error) {
        throw new Error(error.message);
    }
};

// get all bookings
const getAll = async () => {
    try {
        const bookings = await Booking.findAll();
        return bookings;
    } catch (error) {
        throw new Error(error.message);
    }
};

// get booking by id
const getById = async (bookingId) => {
    try {
        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            throw new Error("Booking not found");
        }
        return booking;
    } catch (error) {
        throw new Error(error.message);
    }
};

// update booking
const update = async (bookingId, bookingData) => {
    try {
        const { error } = bookingSchema.updateBookingSchema.validate(bookingData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            throw new Error("Booking not found");
        }

        await Booking.update(bookingData, {
            where: { booking_ID: bookingId }
        });

        const updated = await Booking.findByPk(bookingId);
        return updated;
    } catch (error) {
        throw new Error(error.message);
    }
};

// delete booking
const remove = async (bookingId) => {
    try {
        const deleted = await Booking.destroy({
            where: { booking_ID: bookingId }
        });
        if (!deleted) {
            throw new Error("Booking not found");
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


