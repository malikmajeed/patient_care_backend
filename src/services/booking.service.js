const { Op } = require("sequelize");
const Booking = require("../models/booking.model");
const Nurse = require("../models/nurse.model");
const Patient = require("../models/patient.model");
const User = require("../models/user.model");
const bookingSchema = require("../schema/booking.schema");
const availabilityService = require("./availability.service");
const notificationService = require("./notification.service");
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

// create booking request
const createBookingRequest = async (bookingData) => {
    try {
        const { error } = bookingSchema.createBookingRequestSchema.validate(bookingData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const { nurse_ID, booking_date, start_time, duration_hours } = bookingData;

        // Check nurse availability
        const isAvailable = await availabilityService.checkSlotAvailability(
            nurse_ID,
            booking_date.toISOString().split('T')[0],
            start_time,
            duration_hours
        );

        if (!isAvailable) {
            throw new Error('The requested time slot is not available');
        }

        // Get nurse to calculate cost
        const nurse = await Nurse.findByPk(nurse_ID);
        if (!nurse) {
            throw new Error('Nurse not found');
        }

        if (!nurse.hourly_rate) {
            throw new Error('Nurse hourly rate is not set');
        }

        // Calculate total cost
        const total_cost = parseFloat(nurse.hourly_rate) * parseFloat(duration_hours);

        // Calculate end time
        const [startHour, startMin] = start_time.split(':').map(Number);
        const endTime = new Date(booking_date);
        endTime.setHours(startHour + duration_hours, startMin, 0, 0);
        const end_time = endTime.toTimeString().slice(0, 5);

        // Create booked_datetime (combine date and start_time)
        const booked_datetime = new Date(booking_date);
        booked_datetime.setHours(startHour, startMin, 0, 0);

        // Generate unique booking ID
        const booking_ID = await generateBookingId();

        const booking = await Booking.create({
            booking_ID,
            nurse_ID,
            patient_ID: bookingData.patient_ID,
            booking_status: 'pending_nurse_approval',
            total_cost,
            payment_status: 'unpaid',
            booked_datetime,
            start_time,
            end_time,
            duration_hours: parseFloat(duration_hours),
            service_category_ID: bookingData.service_category_ID || null,
            address_ID: bookingData.address_ID || null,
            special_instructions: bookingData.special_instructions || null,
            emergency_contact: bookingData.emergency_contact || null
        });

        // Create notification for nurse
        try {
            const nurse = await Nurse.findByPk(nurse_ID, { include: [{ model: User }] });
            if (nurse && nurse.USER) {
                await notificationService.create({
                    user_ID: nurse.user_ID,
                    user_type: 'nurse',
                    type: 'booking_request',
                    title: 'New Booking Request',
                    message: `You have received a new booking request for ${booking_date.toISOString().split('T')[0]}`,
                    related_entity_type: 'booking',
                    related_entity_ID: booking.booking_ID
                });
            }
        } catch (notifError) {
            console.error('Failed to create notification:', notifError);
            // Don't fail the booking creation if notification fails
        }

        return {
            ...booking.toJSON(),
            estimated_response_time: '24 hours'
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

// update booking status
const updateBookingStatus = async (bookingId, statusData) => {
    try {
        const { error } = bookingSchema.updateBookingStatusSchema.validate(statusData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            throw new Error('Booking not found');
        }

        // Validate status transition
        const validTransitions = {
            'pending_nurse_approval': ['confirmed', 'cancelled_by_nurse'],
            'confirmed': ['in_progress', 'cancelled_by_patient', 'cancelled_by_nurse', 'cancelled_by_admin'],
            'in_progress': ['completed', 'cancelled_by_admin'],
            'completed': [],
            'cancelled_by_patient': [],
            'cancelled_by_nurse': [],
            'cancelled_by_admin': []
        };

        const currentStatus = booking.booking_status;
        const newStatus = statusData.status;

        if (!validTransitions[currentStatus]?.includes(newStatus)) {
            throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
        }

        await Booking.update(
            { booking_status: newStatus },
            { where: { booking_ID: bookingId } }
        );

        const updated = await Booking.findByPk(bookingId);
        
        // Get patient and nurse with user info for notifications
        const bookingWithRelations = await Booking.findByPk(bookingId, {
            include: [
                {
                    model: Patient,
                    include: [{
                        model: User,
                        attributes: ['user_ID', 'first_name', 'last_name']
                    }]
                },
                {
                    model: Nurse,
                    include: [{
                        model: User,
                        attributes: ['user_ID', 'first_name', 'last_name']
                    }]
                }
            ]
        });

        // Create notifications based on status change
        try {
            if (newStatus === 'confirmed') {
                // Notify patient
                if (bookingWithRelations && bookingWithRelations.PATIENT && bookingWithRelations.PATIENT.USER) {
                    await notificationService.create({
                        user_ID: bookingWithRelations.PATIENT.user_ID,
                        user_type: 'patient',
                        type: 'booking_confirmed',
                        title: 'Booking Confirmed',
                        message: `Your booking request has been confirmed by the nurse`,
                        related_entity_type: 'booking',
                        related_entity_ID: bookingId
                    });
                }
            } else if (newStatus === 'cancelled_by_nurse') {
                // Notify patient
                if (bookingWithRelations && bookingWithRelations.PATIENT && bookingWithRelations.PATIENT.USER) {
                    await notificationService.create({
                        user_ID: bookingWithRelations.PATIENT.user_ID,
                        user_type: 'patient',
                        type: 'booking_cancelled',
                        title: 'Booking Cancelled',
                        message: `The nurse has cancelled your booking request`,
                        related_entity_type: 'booking',
                        related_entity_ID: bookingId
                    });
                }
            } else if (newStatus === 'cancelled_by_patient') {
                // Notify nurse
                if (bookingWithRelations && bookingWithRelations.NURSE && bookingWithRelations.NURSE.USER) {
                    await notificationService.create({
                        user_ID: bookingWithRelations.NURSE.user_ID,
                        user_type: 'nurse',
                        type: 'booking_cancelled',
                        title: 'Booking Cancelled',
                        message: `The patient has cancelled the booking`,
                        related_entity_type: 'booking',
                        related_entity_ID: bookingId
                    });
                }
            }
        } catch (notifError) {
            console.error('Failed to create notification:', notifError);
            // Don't fail the status update if notification fails
        }

        return updated;
    } catch (error) {
        throw new Error(error.message);
    }
};

// get booking requests for nurse
const getBookingRequests = async (nurseId, status = null) => {
    try {
        const whereClause = { nurse_ID: nurseId };
        
        if (status) {
            whereClause.booking_status = status;
        } else {
            whereClause.booking_status = 'pending_nurse_approval';
        }

        const bookings = await Booking.findAll({
            where: whereClause,
            include: [
                {
                    model: Patient,
                    include: [{
                        model: User,
                        attributes: ['first_name', 'last_name', 'email', 'phone_number']
                    }]
                }
            ],
            order: [['booked_datetime', 'ASC']]
        });

        return bookings.map(booking => {
            const json = booking.toJSON();
            if (json.PATIENT && json.PATIENT.USER) {
                json.patient = {
                    patient_ID: json.PATIENT.patient_ID,
                    first_name: json.PATIENT.USER.first_name,
                    last_name: json.PATIENT.USER.last_name,
                    email: json.PATIENT.USER.email,
                    phone_number: json.PATIENT.USER.phone_number
                };
                delete json.PATIENT;
            }
            return json;
        });
    } catch (error) {
        throw new Error(error.message);
    }
};

// get patient bookings
const getPatientBookings = async (patientId, status = null) => {
    try {
        const whereClause = { patient_ID: patientId };
        
        if (status) {
            whereClause.booking_status = status;
        }

        const bookings = await Booking.findAll({
            where: whereClause,
            include: [
                {
                    model: Nurse,
                    include: [{
                        model: User,
                        attributes: ['first_name', 'last_name', 'email', 'phone_number']
                    }]
                }
            ],
            order: [['booked_datetime', 'DESC']]
        });

        return bookings.map(booking => {
            const json = booking.toJSON();
            if (json.NURSE && json.NURSE.USER) {
                json.nurse = {
                    nurse_ID: json.NURSE.nurse_ID,
                    first_name: json.NURSE.USER.first_name,
                    last_name: json.NURSE.USER.last_name,
                    email: json.NURSE.USER.email,
                    phone_number: json.NURSE.USER.phone_number,
                    hourly_rate: json.NURSE.hourly_rate,
                    avg_rating: json.NURSE.avg_rating
                };
                delete json.NURSE;
            }
            return json;
        });
    } catch (error) {
        throw new Error(error.message);
    }
};

// report emergency
const reportEmergency = async (bookingId, emergencyData) => {
    try {
        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            throw new Error('Booking not found');
        }

        // Only allow emergency reporting for active bookings
        if (!['confirmed', 'in_progress'].includes(booking.booking_status)) {
            throw new Error('Emergency can only be reported for active bookings');
        }

        await Booking.update(
            {
                emergency_reported: true,
                emergency_reported_at: new Date(),
                emergency_details: emergencyData.details || emergencyData.message || ''
            },
            { where: { booking_ID: bookingId } }
        );

        // Create notifications for admin and other party
        try {
            const notificationService = require('./notification.service');
            const bookingWithRelations = await Booking.findByPk(bookingId, {
                include: [
                    {
                        model: Patient,
                        include: [{ model: User, attributes: ['user_ID'] }]
                    },
                    {
                        model: Nurse,
                        include: [{ model: User, attributes: ['user_ID'] }]
                    }
                ]
            });

            // Notify admin (get all admins)
            const Admin = require('../models/admin.model');
            const admins = await Admin.findAll({
                include: [{ model: User, attributes: ['user_ID'] }]
            });

            for (const admin of admins) {
                if (admin.USER) {
                    await notificationService.create({
                        user_ID: admin.user_ID,
                        user_type: 'admin',
                        type: 'emergency_alert',
                        title: 'Emergency Reported',
                        message: `Emergency reported for booking ${bookingId}. ${emergencyData.details || ''}`,
                        related_entity_type: 'booking',
                        related_entity_ID: bookingId
                    });
                }
            }

            // Notify the other party
            if (bookingWithRelations) {
                if (bookingWithRelations.PATIENT && bookingWithRelations.PATIENT.USER) {
                    await notificationService.create({
                        user_ID: bookingWithRelations.PATIENT.user_ID,
                        user_type: 'patient',
                        type: 'emergency_alert',
                        title: 'Emergency Alert',
                        message: `An emergency has been reported for your booking`,
                        related_entity_type: 'booking',
                        related_entity_ID: bookingId
                    });
                }
                if (bookingWithRelations.NURSE && bookingWithRelations.NURSE.USER) {
                    await notificationService.create({
                        user_ID: bookingWithRelations.NURSE.user_ID,
                        user_type: 'nurse',
                        type: 'emergency_alert',
                        title: 'Emergency Alert',
                        message: `An emergency has been reported for your booking`,
                        related_entity_type: 'booking',
                        related_entity_ID: bookingId
                    });
                }
            }
        } catch (notifError) {
            console.error('Failed to create emergency notifications:', notifError);
            // Don't fail the emergency report if notification fails
        }

        const updated = await Booking.findByPk(bookingId);
        return updated;
    } catch (error) {
        throw new Error(`Failed to report emergency: ${error.message}`);
    }
};

module.exports = {
    create,
    createBookingRequest,
    getAll,
    getById,
    update,
    updateBookingStatus,
    getBookingRequests,
    getPatientBookings,
    reportEmergency,
    remove
};


