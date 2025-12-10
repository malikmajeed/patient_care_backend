const { Op } = require("sequelize");
const Admin = require("../models/admin.model");
const adminSchema = require("../schema/admin.schema");
const { encryptPassword, comparePassword } = require("../utils/encrypt_password.utils");
const { generateAdminId } = require("../utils/id_genrator.utils");

// create admin
const create = async (adminData) => {
    try {
        adminData.role = "superadmin";
        const { error } = adminSchema.createAdminSchema.validate(adminData);
        if (error) {
            throw new Error(error.details[0].message);
        }
        const isAdminExist = await Admin.findOne({
            where: {
                [Op.or]: [
                    { username: adminData.username },
                    { email: adminData.username }
                ]
            }
        });

        if (isAdminExist) {
            throw new Error("Admin already exists");
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




// update admin data
const update = async (adminId, adminData) => {
    try {
        const { error } = adminSchema.updateAdminSchema.validate(adminData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const admin = await Admin.findByPk(adminId);
        if (!admin) {
            throw new Error("Admin not found");
        }

        if (adminData.password) {
            adminData.password_hash = await encryptPassword(adminData.password);
            delete adminData.password;
        }

        const updatedAdmin = await Admin.update(adminData, {
            where: {
                admin_ID: adminId
            }
        });

        return updatedAdmin;
    } catch (error) {
        throw new Error(error.message);
    }
}

// get all admins
const getAll = async () => {
    try {
        const admins = await Admin.findAll({
            attributes: { exclude: ['password_hash'] }
        });
        return admins;
    } catch (error) {
        throw new Error(error.message);
    }
}

// get admin by id
const getById = async (adminId) => {
    try {
        const admin = await Admin.findByPk(adminId, {
            attributes: { exclude: ['password_hash'] }
        });
        if (!admin) {
            throw new Error("Admin not found");
        }
        return admin;
    } catch (error) {
        throw new Error(error.message);
    }
}

// delete admin
const deleteAdmin = async (adminId) => {
    try {
        const admin = await Admin.findByPk(adminId);
        if (!admin) {
            throw new Error("Admin not found");
        }

        await Admin.destroy({
            where: {
                admin_ID: adminId
            }
        });

        return { message: "Admin deleted successfully" };
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    create,
    login,
    update,
    getAll,
    getById,
    deleteAdmin
};