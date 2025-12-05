const CareRequirement = require("../models/care_requirement.model");
const careRequirementSchema = require("../schema/care_requirement.schema");
const { generateCareRequirementId } = require("../utils/uuid_generator");

// create care requirement
const create = async (careData) => {
    try {
        const { error } = careRequirementSchema.createCareRequirementSchema.validate(careData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        // Generate unique care requirement ID
        const req_ID = await generateCareRequirementId();

        const requirement = await CareRequirement.create({
            req_ID,
            ...careData
        });
        return requirement;
    } catch (error) {
        throw new Error(error.message);
    }
};

// get all requirements
const getAll = async () => {
    try {
        const requirements = await CareRequirement.findAll();
        return requirements;
    } catch (error) {
        throw new Error(error.message);
    }
};

// get by id
const getById = async (reqId) => {
    try {
        const requirement = await CareRequirement.findByPk(reqId);
        if (!requirement) {
            throw new Error("Care requirement not found");
        }
        return requirement;
    } catch (error) {
        throw new Error(error.message);
    }
};

// update requirement
const update = async (reqId, careData) => {
    try {
        const { error } = careRequirementSchema.updateCareRequirementSchema.validate(careData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const requirement = await CareRequirement.findByPk(reqId);
        if (!requirement) {
            throw new Error("Care requirement not found");
        }

        await CareRequirement.update(careData, {
            where: { req_ID: reqId }
        });

        const updated = await CareRequirement.findByPk(reqId);
        return updated;
    } catch (error) {
        throw new Error(error.message);
    }
};

// delete requirement
const remove = async (reqId) => {
    try {
        const deleted = await CareRequirement.destroy({
            where: { req_ID: reqId }
        });
        if (!deleted) {
            throw new Error("Care requirement not found");
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


