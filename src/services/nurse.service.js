const { Op } = require("sequelize");
const Nurse = require("../models/nurse.model");
const User = require("../models/user.model");
const nurseSchema = require("../schema/nurse.schema");
const { encryptPassword, comparePassword } = require("../utils/encrypt_password.utils");
const { generateNurseId, generateUserId } = require("../utils/id_genrator.utils");

// create nurse (signup)
// create nurse (signup)
const create = async (nurseData) => {
    try {
        const { error } = nurseSchema.createNurseSchema.validate(nurseData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        // Check if user exists (email only for nurse)
        const isUserExist = await User.findOne({
            where: { email: nurseData.email }
        });

        if (isUserExist) {
            throw new Error("User with this email already exists");
        }

        const userId = await generateUserId();
        const hashedPassword = await encryptPassword(nurseData.password);

        // Create User
        // Nurse doesn't have username, so leave it null
        const user = await User.create({
            user_ID: userId,
            email: nurseData.email,
            password_hash: hashedPassword,
            first_name: nurseData.first_name,
            last_name: nurseData.last_name,
            gender: nurseData.gender,
            phone_number: nurseData.phone_number,
            role: 'nurse',
            is_verified: false
        });

        nurseData.nurse_ID = await generateNurseId();
        nurseData.user_ID = userId;

        delete nurseData.password;
        delete nurseData.email;
        delete nurseData.first_name;
        delete nurseData.last_name;
        delete nurseData.gender;
        delete nurseData.phone_number;

        const nurse = await Nurse.create(nurseData);
        return {
            ...nurse.toJSON(),
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            gender: user.gender,
            phone_number: user.phone_number,
            role: 'nurse'
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

// login nurse with email
// login nurse with email
const login = async (nurseData) => {
    try {
        const { error } = nurseSchema.loginNurseSchema.validate(nurseData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const user = await User.findOne({
            where: {
                email: nurseData.email
            }
        });

        if (!user) {
            throw new Error("Invalid email or password");
        }

        const isMatch = await comparePassword(nurseData.password, user.password_hash);

        if (!isMatch) {
            throw new Error("Invalid email or password");
        }

        const nurse = await Nurse.findOne({
            where: { user_ID: user.user_ID }
        });

        if (!nurse) {
            throw new Error("Nurse profile not found");
        }

        return {
            ...nurse.toJSON(),
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            gender: user.gender,
            phone_number: user.phone_number,
            user_ID: user.user_ID
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

// update nurse data
// update nurse data
const update = async (nurseId, nurseData) => {
    try {
        const { error } = nurseSchema.updateNurseSchema.validate(nurseData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const nurse = await Nurse.findByPk(nurseId);
        if (!nurse) {
            throw new Error("Nurse not found");
        }

        const updatesToUser = {};
        if (nurseData.password) {
            updatesToUser.password_hash = await encryptPassword(nurseData.password);
            delete nurseData.password;
        }
        if (nurseData.email) {
            updatesToUser.email = nurseData.email;
            delete nurseData.email;
        }
        if (nurseData.first_name) {
            updatesToUser.first_name = nurseData.first_name;
            delete nurseData.first_name;
        }
        if (nurseData.last_name) {
            updatesToUser.last_name = nurseData.last_name;
            delete nurseData.last_name;
        }
        if (nurseData.gender) {
            updatesToUser.gender = nurseData.gender;
            delete nurseData.gender;
        }
        if (nurseData.phone_number) {
            updatesToUser.phone_number = nurseData.phone_number;
            delete nurseData.phone_number;
        }

        if (Object.keys(updatesToUser).length > 0) {
            await User.update(updatesToUser, { where: { user_ID: nurse.user_ID } });
        }

        await Nurse.update(nurseData, {
            where: { nurse_ID: nurseId }
        });

        const updated = await Nurse.findByPk(nurseId);
        return updated;
    } catch (error) {
        throw new Error(error.message);
    }
};

// get a single nurse
const getById = async (nurseId) => {
    try {
        const nurse = await Nurse.findByPk(nurseId, {
            include: [{
                model: User,
                attributes: ['email', 'first_name', 'last_name', 'gender', 'phone_number', 'is_active']
            }]
        });
        if (!nurse) {
            throw new Error("Nurse not found");
        }

        const json = nurse.toJSON();
        if (json.USER) {
            json.email = json.USER.email;
            json.first_name = json.USER.first_name;
            json.last_name = json.USER.last_name;
            json.gender = json.USER.gender;
            json.phone_number = json.USER.phone_number;
            json.is_active = json.USER.is_active;
            delete json.USER;
        }
        return json;
    } catch (error) {
        throw new Error(error.message);
    }
};

// get all nurses
const getAll = async () => {
    try {
        const nurses = await Nurse.findAll({
            include: [{
                model: User,
                attributes: ['email', 'first_name', 'last_name', 'gender', 'phone_number', 'is_active']
            }]
        });

        return nurses.map(nurse => {
            const json = nurse.toJSON();
            if (json.USER) {
                json.email = json.USER.email;
                json.first_name = json.USER.first_name;
                json.last_name = json.USER.last_name;
                json.gender = json.USER.gender;
                json.phone_number = json.USER.phone_number;
                json.is_active = json.USER.is_active;
                delete json.USER;
            }
            return json;
        });
    } catch (error) {
        throw new Error(error.message);
    }
};

// delete nurse
const remove = async (nurseId) => {
    try {
        const deleted = await Nurse.destroy({ where: { nurse_ID: nurseId } });
        if (!deleted) {
            throw new Error("Nurse not found");
        }
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    create,
    login,
    update,
    getById,
    getAll,
    remove
};


