const bookingService = require("../services/booking.service");

const createBookingRequest = async (req, res) => {
    try {
        const booking = await bookingService.createBookingRequest(req.body);
        res.status(201).json({
            success: true,
            message: "Booking request created successfully",
            booking
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        const booking = await bookingService.updateBookingStatus(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Booking status updated successfully",
            booking
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

const getBookingRequests = async (req, res) => {
    try {
        const { status } = req.query;
        const nurseId = req.user?.user_id; // Assuming auth middleware sets req.user
        
        // For now, get from query param if not in user context
        const actualNurseId = req.query.nurseId || nurseId;
        
        if (!actualNurseId) {
            return res.status(400).json({
                success: false,
                error: 'Nurse ID is required'
            });
        }

        const bookings = await bookingService.getBookingRequests(actualNurseId, status);
        res.status(200).json({
            success: true,
            bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const getPatientBookings = async (req, res) => {
    try {
        const { patientId } = req.params;
        const { status } = req.query;

        const bookings = await bookingService.getPatientBookings(patientId, status);
        res.status(200).json({
            success: true,
            bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const reportEmergency = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await bookingService.reportEmergency(id, req.body);
        res.status(200).json({
            success: true,
            message: "Emergency reported successfully. Help is on the way.",
            booking
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

const create = async (req, res) => {
    try {
        const booking = await bookingService.create(req.body);
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking
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
        const bookings = await bookingService.getAll();
        res.status(200).json({
            success: true,
            bookings
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
        const booking = await bookingService.getById(req.params.id);
        res.status(200).json({
            success: true,
            booking
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
        const booking = await bookingService.update(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Booking updated successfully",
            booking
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
        await bookingService.remove(req.params.id);
        res.status(200).json({
            success: true,
            message: "Booking deleted successfully"
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
    createBookingRequest,
    updateBookingStatus,
    getBookingRequests,
    getPatientBookings,
    reportEmergency,
    getAll,
    getById,
    update,
    remove
};


