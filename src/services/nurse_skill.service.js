const NurseSkill = require("../models/nurse_skill.model");
const nurseSkillSchema = require("../schema/nurse_skill.schema");

// create nurse_skill
const create = async (data) => {
    try {
        const { error } = nurseSkillSchema.createNurseSkillSchema.validate(data);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const skill = await NurseSkill.create(data);
        return skill;
    } catch (error) {
        throw new Error(error.message);
    }
};

// get all nurse skills
const getAll = async () => {
    try {
        const skills = await NurseSkill.findAll();
        return skills;
    } catch (error) {
        throw new Error(error.message);
    }
};

// get by composite id
const getById = async (nurseId, categoryId) => {
    try {
        const skill = await NurseSkill.findOne({
            where: { nurse_ID: nurseId, category_ID: categoryId }
        });
        if (!skill) {
            throw new Error("Nurse skill not found");
        }
        return skill;
    } catch (error) {
        throw new Error(error.message);
    }
};

// update
const update = async (nurseId, categoryId, data) => {
    try {
        const { error } = nurseSkillSchema.updateNurseSkillSchema.validate(data);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const skill = await NurseSkill.findOne({
            where: { nurse_ID: nurseId, category_ID: categoryId }
        });
        if (!skill) {
            throw new Error("Nurse skill not found");
        }

        await NurseSkill.update(data, {
            where: { nurse_ID: nurseId, category_ID: categoryId }
        });

        const updated = await NurseSkill.findOne({
            where: { nurse_ID: nurseId, category_ID: categoryId }
        });
        return updated;
    } catch (error) {
        throw new Error(error.message);
    }
};

// delete
const remove = async (nurseId, categoryId) => {
    try {
        const deleted = await NurseSkill.destroy({
            where: { nurse_ID: nurseId, category_ID: categoryId }
        });
        if (!deleted) {
            throw new Error("Nurse skill not found");
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


