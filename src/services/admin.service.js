const { Op } = require("sequelize");
const Admin = require("../models/admin.model");
const adminSchema = require("../schema/admin.schema");
const { encryptPassword, comparePassword } = require("../utils/encrypt_password");
const { generateAdminId } = require("../utils/id_genrator");

// create admin
const create = async (adminData) => {
    try {
        adminData.role = "superadmin";
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

// login admin with username and email

const login = async (adminData) => {
    try {
        const { error } = adminSchema.loginAdminSchema.validate(adminData);
        if (error) {
            throw new Error("Validation Error", error.details[0].message);
        }


        // find admin by username or email and password
        const admin = await Admin.findOne({
            where: {
                [Op.or]: [
                    { username: adminData.username },
                    { email: adminData.username }
                ]
            }
        });

        if (!admin) {
            throw new Error("Invalid username or password");
        }

        const isMatch = await comparePassword(adminData.password, admin.password_hash);

        if (!isMatch) {
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