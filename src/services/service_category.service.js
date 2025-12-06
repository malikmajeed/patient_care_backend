const ServiceCategory = require("../models/service_category.model");
const serviceCategorySchema = require("../schema/service_category.schema");
const { generateServiceCategoryId } = require("../utils/uuid_generator.utils");

// create category
const create = async (categoryData) => {
    try {
        const { error } = serviceCategorySchema.createServiceCategorySchema.validate(categoryData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        // Generate unique category ID
        const category_ID = await generateServiceCategoryId();

        const category = await ServiceCategory.create({
            category_ID,
            ...categoryData
        });
        return category;
    } catch (error) {
        throw new Error(error.message);
    }
};

// get all categories
const getAll = async () => {
    try {
        const categories = await ServiceCategory.findAll();
        return categories;
    } catch (error) {
        throw new Error(error.message);
    }
};

// get by id
const getById = async (categoryId) => {
    try {
        const category = await ServiceCategory.findByPk(categoryId);
        if (!category) {
            throw new Error("Service category not found");
        }
        return category;
    } catch (error) {
        throw new Error(error.message);
    }
};

// update category
const update = async (categoryId, categoryData) => {
    try {
        const { error } = serviceCategorySchema.updateServiceCategorySchema.validate(categoryData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const category = await ServiceCategory.findByPk(categoryId);
        if (!category) {
            throw new Error("Service category not found");
        }

        await ServiceCategory.update(categoryData, {
            where: { category_ID: categoryId }
        });

        const updated = await ServiceCategory.findByPk(categoryId);
        return updated;
    } catch (error) {
        throw new Error(error.message);
    }
};

// delete category
const remove = async (categoryId) => {
    try {
        const deleted = await ServiceCategory.destroy({
            where: { category_ID: categoryId }
        });
        if (!deleted) {
            throw new Error("Service category not found");
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


