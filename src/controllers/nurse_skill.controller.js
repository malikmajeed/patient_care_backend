const nurseSkillService = require("../services/nurse_skill.service");

const create = async (req, res) => {
    try {
        const skill = await nurseSkillService.create(req.body);
        res.status(201).json({
            success: true,
            message: "Nurse skill created successfully",
            skill
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
        const skills = await nurseSkillService.getAll();
        res.status(200).json({
            success: true,
            skills
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
        const skill = await nurseSkillService.getById(req.params.nurseId, req.params.categoryId);
        res.status(200).json({
            success: true,
            skill
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
        const skill = await nurseSkillService.update(req.params.nurseId, req.params.categoryId, req.body);
        res.status(200).json({
            success: true,
            message: "Nurse skill updated successfully",
            skill
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
        await nurseSkillService.remove(req.params.nurseId, req.params.categoryId);
        res.status(200).json({
            success: true,
            message: "Nurse skill deleted successfully"
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


