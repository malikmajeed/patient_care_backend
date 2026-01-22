const workScheduleService = require("../services/work_schedule.service");

const create = async (req, res) => {
    try {
        const schedule = await workScheduleService.create(req.body);
        res.status(201).json({
            success: true,
            message: "Work schedule created successfully",
            schedule
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
        const schedules = await workScheduleService.getAll();
        res.status(200).json({
            success: true,
            schedules
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
        const schedule = await workScheduleService.getById(req.params.id);
        res.status(200).json({
            success: true,
            schedule
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
        const schedule = await workScheduleService.update(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "Work schedule updated successfully",
            schedule
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
        await workScheduleService.remove(req.params.id);
        res.status(200).json({
            success: true,
            message: "Work schedule deleted successfully"
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            error: error.message
        });
    }
};

const bulkUpdate = async (req, res) => {
    try {
        const { nurseId } = req.params;
        const { schedules } = req.body;

        if (!schedules || !Array.isArray(schedules)) {
            return res.status(400).json({
                success: false,
                error: 'Schedules array is required'
            });
        }

        const updatedSchedules = await workScheduleService.bulkUpdate(nurseId, schedules);
        res.status(200).json({
            success: true,
            message: "Work schedules updated successfully",
            schedules: updatedSchedules
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

const getNurseSchedule = async (req, res) => {
    try {
        const { nurseId } = req.params;
        const schedules = await workScheduleService.getNurseSchedule(nurseId);
        res.status(200).json({
            success: true,
            schedules
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const blockDate = async (req, res) => {
    try {
        const { nurseId } = req.params;
        const { date, reason } = req.body;

        if (!date) {
            return res.status(400).json({
                success: false,
                error: 'Date is required'
            });
        }

        const blocked = await workScheduleService.blockDate(nurseId, date, reason);
        res.status(200).json({
            success: true,
            message: "Date blocked successfully",
            blocked
        });
    } catch (error) {
        res.status(400).json({
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
    remove,
    bulkUpdate,
    getNurseSchedule,
    blockDate
};


