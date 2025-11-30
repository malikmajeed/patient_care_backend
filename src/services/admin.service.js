const Admin = require("../models/admin.model");
const adminSchema = require("../schema/admin.schema");
const encryptPassword = require("../utils/encrypt_password");
const { generateAdminId } = require("../utils/id_genrator");

// create admin
const create = async (adminData) => {
    try {
        const { error } = adminSchema.createAdminSchema.validate(adminData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        adminData.admin_ID = await generateAdminId();


        adminData.password_hash = await encryptPassword(adminData.password);
        delete adminData.password;

        const admin = await Admin.create(adminData);
        return admin;
    } catch (error) {
        throw new Error(error.message);
    }
}

const login = async ({ username, password }) => {
    try {
        const { error } = adminSchema.loginAdminSchema.validate({ username, password });
        if (error) {
            throw new Error(error.details[0].message);
        }

        const admin = await Admin.findOne({ where: { username } });
        if (!admin) {
            throw new Error("Invalid username or password");
        }

        const validPassword = await encryptPassword.compare(password, admin.password_hash);
        if (!validPassword) {
            throw new Error("Invalid username or password");
        }

        return admin;
    } catch (error) {
        throw new Error(error.message);
    }
}

const update = async (adminId, adminData) => {
    try {
        const { error, value } = adminSchema.updateAdminSchema.validate(adminData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const admin = await Admin.findByPk(adminId);
        if (!admin) {
            throw new Error("Admin not found");
        }

        if (value.password) {
            value.password_hash = await encryptPassword(value.password);
            delete value.password;
        }

        await admin.update(value);
        return admin;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    create,
    login,
    update
};