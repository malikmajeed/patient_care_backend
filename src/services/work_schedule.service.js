const { Op } = require("sequelize");
const WorkSchedule = require("../models/work_schedule.model");
const workScheduleSchema = require("../schema/work_schedule.schema");
const { generateWorkScheduleId } = require("../utils/uuid_generator.utils");

// create work schedule
const create = async (workData) => {
    try {
        const { error } = workScheduleSchema.createWorkScheduleSchema.validate(workData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        // Generate unique work schedule ID
        const work_id = await generateWorkScheduleId();

        const schedule = await WorkSchedule.create({
            work_id,
            ...workData
        });
        return schedule;
    } catch (error) {
        throw new Error(error.message);
    }
};

// get all work schedules
const getAll = async () => {
    try {
        const schedules = await WorkSchedule.findAll();
        return schedules;
    } catch (error) {
        throw new Error(error.message);
    }
};

// get by id
const getById = async (workId) => {
    try {
        const schedule = await WorkSchedule.findByPk(workId);
        if (!schedule) {
            throw new Error("Work schedule not found");
        }
        return schedule;
    } catch (error) {
        throw new Error(error.message);
    }
};

// update work schedule
const update = async (workId, workData) => {
    try {
        const { error } = workScheduleSchema.updateWorkScheduleSchema.validate(workData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const schedule = await WorkSchedule.findByPk(workId);
        if (!schedule) {
            throw new Error("Work schedule not found");
        }

        await WorkSchedule.update(workData, {
            where: { work_id: workId }
        });

        const updated = await WorkSchedule.findByPk(workId);
        return updated;
    } catch (error) {
        throw new Error(error.message);
    }
};

// delete work schedule
const remove = async (workId) => {
    try {
        const deleted = await WorkSchedule.destroy({
            where: { work_id: workId }
        });
        if (!deleted) {
            throw new Error("Work schedule not found");
        }
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};

// bulk update work schedules for a nurse
const bulkUpdate = async (nurseId, schedules) => {
    try {
        // Delete existing schedules for this nurse
        await WorkSchedule.destroy({
            where: { nurse_ID: nurseId }
        });

        // Create new schedules
        const createdSchedules = [];
        for (const schedule of schedules) {
            const work_id = await generateWorkScheduleId();
            const newSchedule = await WorkSchedule.create({
                work_id,
                nurse_ID: nurseId,
                day: schedule.day_of_week,
                time_range: `${schedule.start_time}-${schedule.end_time}`
            });
            createdSchedules.push(newSchedule);
        }

        return createdSchedules;
    } catch (error) {
        throw new Error(`Failed to bulk update schedules: ${error.message}`);
    }
};

// get nurse schedule
const getNurseSchedule = async (nurseId) => {
    try {
        const schedules = await WorkSchedule.findAll({
            where: { nurse_ID: nurseId },
            order: [
                ['day', 'ASC']
            ]
        });

        // Format schedules
        return schedules.map(schedule => {
            const [startTime, endTime] = schedule.time_range.split('-');
            return {
                work_id: schedule.work_id,
                day_of_week: schedule.day,
                start_time: startTime,
                end_time: endTime
            };
        });
    } catch (error) {
        throw new Error(`Failed to get nurse schedule: ${error.message}`);
    }
};

// block date (create a model for blocked dates if needed, or use a simple approach)
// For now, we'll create a simple blocked dates table
const blockDate = async (nurseId, date, reason = '') => {
    try {
        // This would require a BlockedDate model
        // For now, we'll return a placeholder
        // In a full implementation, you'd create a BlockedDate record
        return {
            nurse_ID: nurseId,
            blocked_date: date,
            reason: reason
        };
    } catch (error) {
        throw new Error(`Failed to block date: ${error.message}`);
    }
};

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove,
    bulkUpdate,
    getNurseSchedule,
    blockDate
};


