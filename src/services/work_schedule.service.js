const WorkSchedule = require("../models/work_schedule.model");
const workScheduleSchema = require("../schema/work_schedule.schema");

// create work schedule
const create = async (workData) => {
    try {
        const { error } = workScheduleSchema.createWorkScheduleSchema.validate(workData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const schedule = await WorkSchedule.create(workData);
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

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove
};


