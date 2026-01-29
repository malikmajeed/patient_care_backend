const { Op } = require("sequelize");
const WorkSchedule = require("../models/work_schedule.model");
const Booking = require("../models/booking.model");

/**
 * Get available time slots for a nurse on a specific date
 * @param {string} nurseId - Nurse ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Available time slots
 */
const getAvailability = async (nurseId, date) => {
    try {
        const targetDate = new Date(date);
        // Get day name and convert to lowercase (e.g., "monday", "tuesday")
        const dayOfWeek = targetDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

        // Get nurse's work schedule for this day
        const workSchedule = await WorkSchedule.findOne({
            where: {
                nurse_ID: nurseId,
                day: dayOfWeek
            }
        });

        if (!workSchedule) {
            return {
                date,
                available: false,
                message: 'Nurse is not available on this day',
                available_slots: []
            };
        }

        // Parse time range (format: "09:00-17:00")
        const [startTime, endTime] = workSchedule.time_range.split('-');
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);

        const scheduleStart = new Date(targetDate);
        scheduleStart.setHours(startHour, startMin, 0, 0);

        const scheduleEnd = new Date(targetDate);
        scheduleEnd.setHours(endHour, endMin, 0, 0);

        // Get existing bookings for this date
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        const existingBookings = await Booking.findAll({
            where: {
                nurse_ID: nurseId,
                booked_datetime: {
                    [Op.between]: [startOfDay, endOfDay]
                },
                booking_status: {
                    [Op.in]: ['pending_nurse_approval', 'confirmed', 'in_progress']
                }
            },
            order: [['booked_datetime', 'ASC']]
        });

        // Generate available time slots (1-hour intervals)
        const availableSlots = [];
        const slotDuration = 60; // minutes

        let currentTime = new Date(scheduleStart);
        
        while (currentTime < scheduleEnd) {
            const slotStart = new Date(currentTime);
            const slotEnd = new Date(currentTime);
            slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);

            // Check if this slot conflicts with existing bookings
            const hasConflict = existingBookings.some(booking => {
                const bookingStart = new Date(booking.booked_datetime);
                const bookingEnd = new Date(bookingStart);
                
                // If booking has duration, calculate end time
                if (booking.duration_hours) {
                    bookingEnd.setHours(bookingEnd.getHours() + booking.duration_hours);
                } else {
                    // Default to 1 hour if no duration specified
                    bookingEnd.setHours(bookingEnd.getHours() + 1);
                }

                // Check for overlap
                return (slotStart < bookingEnd && slotEnd > bookingStart);
            });

            if (!hasConflict) {
                availableSlots.push({
                    start_time: slotStart.toTimeString().slice(0, 5), // HH:MM format
                    end_time: slotEnd.toTimeString().slice(0, 5),
                    status: 'available'
                });
            } else {
                availableSlots.push({
                    start_time: slotStart.toTimeString().slice(0, 5),
                    end_time: slotEnd.toTimeString().slice(0, 5),
                    status: 'booked'
                });
            }

            currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
        }

        return {
            date,
            available: availableSlots.some(slot => slot.status === 'available'),
            nurse_schedule: {
                day_of_week: dayOfWeek,
                working_hours: workSchedule.time_range,
                start_time: startTime,
                end_time: endTime
            },
            available_slots: availableSlots
        };
    } catch (error) {
        throw new Error(`Failed to get availability: ${error.message}`);
    }
};

/**
 * Check if a specific time slot is available
 * @param {string} nurseId - Nurse ID
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} startTime - Start time in HH:MM format
 * @param {number} durationHours - Duration in hours
 * @returns {Promise<boolean>} True if available
 */
const checkSlotAvailability = async (nurseId, date, startTime, durationHours = 1) => {
    try {
        const availability = await getAvailability(nurseId, date);
        
        if (!availability.available) {
            return false;
        }

        const [startHour, startMin] = startTime.split(':').map(Number);
        const targetDate = new Date(date);
        const slotStart = new Date(targetDate);
        slotStart.setHours(startHour, startMin, 0, 0);

        const slotEnd = new Date(slotStart);
        slotEnd.setHours(slotEnd.getHours() + durationHours);

        // Check if the requested slot is within available slots
        const availableSlot = availability.available_slots.find(slot => {
            const [slotStartHour, slotStartMin] = slot.start_time.split(':').map(Number);
            const [slotEndHour, slotEndMin] = slot.end_time.split(':').map(Number);
            
            const slotStartTime = new Date(targetDate);
            slotStartTime.setHours(slotStartHour, slotStartMin, 0, 0);
            
            const slotEndTime = new Date(targetDate);
            slotEndTime.setHours(slotEndHour, slotEndMin, 0, 0);

            return slot.status === 'available' && 
                   slotStart >= slotStartTime && 
                   slotEnd <= slotEndTime;
        });

        return !!availableSlot;
    } catch (error) {
        throw new Error(`Failed to check slot availability: ${error.message}`);
    }
};

module.exports = {
    getAvailability,
    checkSlotAvailability
};
