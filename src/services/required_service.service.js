const RequiredService = require("../models/required_service.model");
const requiredServiceSchema = require("../schema/required_service.schema");

// create required_service
const create = async (data) => {
    try {
        const { error } = requiredServiceSchema.createRequiredServiceSchema.validate(data);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const reqService = await RequiredService.create(data);
        return reqService;
    } catch (error) {
        throw new Error(error.message);
    }
};

// get all
const getAll = async () => {
    try {
        const items = await RequiredService.findAll();
        return items;
    } catch (error) {
        throw new Error(error.message);
    }
};

// get by composite id
const getById = async (reqId, categoryId) => {
    try {
        const item = await RequiredService.findOne({
            where: { req_ID: reqId, category_ID: categoryId }
        });
        if (!item) {
            throw new Error("Required service not found");
        }
        return item;
    } catch (error) {
        throw new Error(error.message);
    }
};

// update
const update = async (reqId, categoryId, data) => {
    try {
        const { error } = requiredServiceSchema.updateRequiredServiceSchema.validate(data);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const item = await RequiredService.findOne({
            where: { req_ID: reqId, category_ID: categoryId }
        });
        if (!item) {
            throw new Error("Required service not found");
        }

        await RequiredService.update(data, {
            where: { req_ID: reqId, category_ID: categoryId }
        });

        const updated = await RequiredService.findOne({
            where: { req_ID: reqId, category_ID: categoryId }
        });
        return updated;
    } catch (error) {
        throw new Error(error.message);
    }
};

// delete
const remove = async (reqId, categoryId) => {
    try {
        const deleted = await RequiredService.destroy({
            where: { req_ID: reqId, category_ID: categoryId }
        });
        if (!deleted) {
            throw new Error("Required service not found");
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


