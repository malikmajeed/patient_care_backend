const { Op } = require("sequelize");
const Nurse = require("../models/nurse.model");
const User = require("../models/user.model");
const NurseSkill = require("../models/nurse_skill.model");
const ServiceCategory = require("../models/service_category.model");
const WorkSchedule = require("../models/work_schedule.model");
const Booking = require("../models/booking.model");
const Review = require("../models/review.model");
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
            username: nurseData.username,
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
        delete nurseData.username;
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

// search nurses with filters
const searchNurses = async (filters) => {
    try {
        const {
            location,
            skills,
            date,
            minPrice,
            maxPrice,
            minRating,
            gender,
            verifiedOnly,
            page = 1,
            limit = 20,
            sortBy = 'rating',
            sortOrder = 'DESC'
        } = filters;

        const offset = (page - 1) * limit;
        const whereClause = {};
        const userWhereClause = {};

        // Verification status filter
        if (verifiedOnly === 'true' || verifiedOnly === true) {
            whereClause.verification_status = 'verified';
        }

        // Gender filter
        if (gender) {
            userWhereClause.gender = gender;
        }

        // Price range filter
        if (minPrice !== undefined && minPrice !== null) {
            whereClause.hourly_rate = {
                ...whereClause.hourly_rate,
                [Op.gte]: parseFloat(minPrice)
            };
        }
        if (maxPrice !== undefined && maxPrice !== null) {
            whereClause.hourly_rate = {
                ...whereClause.hourly_rate,
                [Op.lte]: parseFloat(maxPrice)
            };
        }

        // Rating filter
        if (minRating !== undefined && minRating !== null) {
            whereClause.avg_rating = {
                [Op.gte]: parseFloat(minRating)
            };
        }

        // Location filter (search in address field)
        if (location) {
            whereClause.address = {
                [Op.iLike]: `%${location}%`
            };
        }

        // Build query with includes
        const includeOptions = [
            {
                model: User,
                attributes: ['email', 'first_name', 'last_name', 'gender', 'phone_number', 'is_active'],
                where: userWhereClause
            },
            {
                model: NurseSkill,
                required: false,
                include: [{
                    model: ServiceCategory,
                    attributes: ['category_ID', 'category_name']
                }]
            },
            {
                model: WorkSchedule,
                required: false
            }
        ];

        // Skills filter - if skills are provided, filter by service categories
        if (skills && Array.isArray(skills) && skills.length > 0) {
            includeOptions[1].required = true;
            includeOptions[1].where = {
                category_ID: {
                    [Op.in]: skills
                }
            };
        }

        // Sorting
        let orderClause = [];
        switch (sortBy) {
            case 'price':
                orderClause = [['hourly_rate', sortOrder]];
                break;
            case 'experience':
                orderClause = [['years_of_experience', sortOrder]];
                break;
            case 'rating':
            default:
                orderClause = [['avg_rating', sortOrder]];
                break;
        }

        // Execute query
        const { count, rows } = await Nurse.findAndCountAll({
            where: whereClause,
            include: includeOptions,
            distinct: true,
            order: orderClause,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        // Format results
        const nurses = rows.map(nurse => {
            const json = nurse.toJSON();
            
            // Flatten user data
            if (json.USER) {
                json.email = json.USER.email;
                json.first_name = json.USER.first_name;
                json.last_name = json.USER.last_name;
                json.gender = json.USER.gender;
                json.phone_number = json.USER.phone_number;
                json.is_active = json.USER.is_active;
                delete json.USER;
            }

            // Format skills - Sequelize uses model name for associations
            const nurseSkillsKey = Object.keys(json).find(key => 
                key.toLowerCase().includes('nurseskill') || key.toLowerCase().includes('nurse_skill')
            );
            if (nurseSkillsKey && Array.isArray(json[nurseSkillsKey])) {
                const skills = json[nurseSkillsKey].map(ns => {
                    const categoryKey = Object.keys(ns).find(k => 
                        k.toLowerCase().includes('servicecategory') || k.toLowerCase().includes('service_category')
                    );
                    return {
                        category_ID: ns[categoryKey]?.category_ID,
                        category_name: ns[categoryKey]?.category_name
                    };
                }).filter(s => s.category_ID);
                json.skills = skills;
                delete json[nurseSkillsKey];
            } else {
                json.skills = [];
            }

            // Format work schedules
            const workScheduleKey = Object.keys(json).find(key => 
                key.toLowerCase().includes('workschedule') || key.toLowerCase().includes('work_schedule') || key.toLowerCase().includes('work')
            );
            if (workScheduleKey && Array.isArray(json[workScheduleKey])) {
                json.work_schedules = json[workScheduleKey];
                delete json[workScheduleKey];
            } else {
                json.work_schedules = [];
            }

            // Calculate next available slot (simplified - would need more complex logic with date)
            json.next_available = null; // Will be calculated by availability service

            return json;
        });

        return {
            nurses,
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit)
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

// update verification status
const updateVerificationStatus = async (nurseId, verificationData) => {
    try {
        const { status, admin_notes, rejection_reason, required_documents } = verificationData;

        if (!['verified', 'rejected', 'pending'].includes(status)) {
            throw new Error('Invalid verification status');
        }

        const nurse = await Nurse.findByPk(nurseId);
        if (!nurse) {
            throw new Error('Nurse not found');
        }

        const updateData = { verification_status: status };
        
        // Store admin notes and rejection reason in a notes field or separate table
        // For now, we'll add them to a notes field if it exists, or store in a separate table
        
        await Nurse.update(updateData, {
            where: { nurse_ID: nurseId }
        });

        // Create notification for nurse
        try {
            const notificationService = require('./notification.service');
            const nurseWithUser = await Nurse.findByPk(nurseId, {
                include: [{ model: User }]
            });

            if (nurseWithUser && nurseWithUser.USER) {
                let notificationTitle = '';
                let notificationMessage = '';

                if (status === 'verified') {
                    notificationTitle = 'Verification Approved';
                    notificationMessage = 'Your verification has been approved. You can now accept bookings.';
                } else if (status === 'rejected') {
                    notificationTitle = 'Verification Rejected';
                    notificationMessage = rejection_reason || 'Your verification has been rejected. Please review and resubmit.';
                }

                if (notificationTitle) {
                    await notificationService.create({
                        user_ID: nurseWithUser.user_ID,
                        user_type: 'nurse',
                        type: 'verification_status_update',
                        title: notificationTitle,
                        message: notificationMessage,
                        related_entity_type: 'nurse',
                        related_entity_ID: nurseId
                    });
                }
            }
        } catch (notifError) {
            console.error('Failed to create notification:', notifError);
            // Don't fail the verification update if notification fails
        }

        const updated = await Nurse.findByPk(nurseId);
        return updated;
    } catch (error) {
        throw new Error(`Failed to update verification status: ${error.message}`);
    }
};

module.exports = {
    create,
    login,
    update,
    getById,
    getAll,
    remove,
    searchNurses,
    updateVerificationStatus
};


