const { Op, fn, col } = require("sequelize");
const Admin = require("../models/admin.model");
const User = require("../models/user.model");
const Patient = require("../models/patient.model");
const Nurse = require("../models/nurse.model");
const Booking = require("../models/booking.model");
const Payment = require("../models/payment.model");
const Review = require("../models/review.model");
const adminSchema = require("../schema/admin.schema");
const userSchema = require("../schema/user.schema");
const { encryptPassword, comparePassword } = require("../utils/encrypt_password.utils");
const { generateAdminId, generateUserId } = require("../utils/id_genrator.utils");

// create admin
// create admin
const create = async (adminData) => {
    try {


        const { error: userError } = userSchema.createUserSchema.validate(adminData);
        if (userError) {
            throw new Error(userError.details[0].message);
        }
        adminData.role = "superadmin"; // Default internal role if not provided? Schema says required.
        const { error } = adminSchema.createAdminSchema.validate(adminData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        // Check if user exists
        const isUserExist = await User.findOne({
            where: {
                [Op.or]: [
                    { username: adminData.username },
                    { email: adminData.email }
                ]
            }
        });

        if (isUserExist) {
            throw new Error("User with this username or email already exists");
        }

        const userId = await generateUserId();
        const hashedPassword = await encryptPassword(adminData.password);

        // Create User
        const user = await User.create({
            user_ID: userId,
            username: adminData.username,
            email: adminData.email,
            password_hash: hashedPassword,
            first_name: adminData.first_name,
            last_name: adminData.last_name,
            profile_url: adminData.profile_url,
            role: 'admin',
            is_verified: true
        });

        // Create Admin Profile
        adminData.admin_ID = await generateAdminId();
        adminData.user_ID = userId;

        // Remove auth and profile fields not in Admin model
        delete adminData.password;
        delete adminData.email;
        delete adminData.username;
        delete adminData.first_name;
        delete adminData.last_name;
        delete adminData.profile_url;

        const admin = await Admin.create(adminData);

        // Return combined object
        return {
            ...admin.toJSON(),
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            profile_url: user.profile_url,
            role: admin.role,
            user_role: user.role
        };
    } catch (error) {
        throw new Error(error.message);
    }
}

// login admin with username and email

// login admin with username or email
const login = async (adminData) => {
    try {
        const { error } = adminSchema.loginAdminSchema.validate(adminData);
        if (error) {
            throw new Error(error.details[0].message); // Fix "Validation Error" double message
        }

        // find user by username or email
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { username: adminData.username },
                    { email: adminData.username }
                ]
            }
        });

        if (!user) {
            throw new Error("Invalid username or password");
        }

        const isMatch = await comparePassword(adminData.password, user.password_hash);

        if (!isMatch) {
            throw new Error("Invalid username or password");
        }

        // Find Admin profile
        const admin = await Admin.findOne({
            where: { user_ID: user.user_ID }
        });

        if (!admin) {
            throw new Error("Admin profile not found");
        }

        return {
            ...admin.toJSON(),
            email: user.email,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            profile_url: user.profile_url,
            role: admin.role,
            password_hash: user.password_hash,
            user_ID: user.user_ID
        };

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

        const updatesToUser = {};
        if (adminData.password) {
            updatesToUser.password_hash = await encryptPassword(adminData.password);
            delete adminData.password;
        }
        if (adminData.email) {
            updatesToUser.email = adminData.email;
            delete adminData.email;
        }
        if (adminData.username) {
            updatesToUser.username = adminData.username;
            delete adminData.username;
        }
        if (adminData.first_name) {
            updatesToUser.first_name = adminData.first_name;
            delete adminData.first_name;
        }
        if (adminData.last_name) {
            updatesToUser.last_name = adminData.last_name;
            delete adminData.last_name;
        }
        if (adminData.profile_url !== undefined) {
            updatesToUser.profile_url = adminData.profile_url;
            delete adminData.profile_url;
        }

        if (Object.keys(updatesToUser).length > 0) {
            await User.update(updatesToUser, {
                where: { user_ID: admin.user_ID }
            });
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
            include: [{
                model: User,
                attributes: ['email', 'username', 'first_name', 'last_name', 'profile_url', 'role', 'is_verified', 'is_active']
            }]
        });

        return admins.map(admin => {
            const adminJson = admin.toJSON();
            if (adminJson.USER) {
                adminJson.email = adminJson.USER.email;
                adminJson.username = adminJson.USER.username;
                adminJson.first_name = adminJson.USER.first_name;
                adminJson.last_name = adminJson.USER.last_name;
                adminJson.profile_url = adminJson.USER.profile_url;
                adminJson.user_role = adminJson.USER.role;
                adminJson.is_verified = adminJson.USER.is_verified;
                adminJson.is_active = adminJson.USER.is_active;
                delete adminJson.USER;
            }
            return adminJson;
        });
    } catch (error) {
        throw new Error(error.message);
    }
}

// get admin by id
const getById = async (adminId) => {
    try {
        const admin = await Admin.findByPk(adminId, {
            include: [{
                model: User,
                attributes: ['email', 'username', 'first_name', 'last_name', 'profile_url', 'role', 'is_verified', 'is_active']
            }]
        });
        if (!admin) {
            throw new Error("Admin not found");
        }

        const adminJson = admin.toJSON();
        if (adminJson.USER) {
            adminJson.email = adminJson.USER.email;
            adminJson.username = adminJson.USER.username;
            adminJson.first_name = adminJson.USER.first_name;
            adminJson.last_name = adminJson.USER.last_name;
            adminJson.profile_url = adminJson.USER.profile_url;
            adminJson.user_role = adminJson.USER.role;
            adminJson.is_verified = adminJson.USER.is_verified;
            adminJson.is_active = adminJson.USER.is_active;
            delete adminJson.USER;
        }
        return adminJson;
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

// get dashboard statistics
const getDashboardStats = async () => {
    try {
        const [
            totalRevenue,
            activeBookings,
            pendingVerifications,
            totalUsers,
            totalNurses,
            totalPatients
        ] = await Promise.all([
            // Total revenue from successful payments
            Payment.sum('amount', {
                where: { status: 'successful' }
            }) || 0,
            // Active bookings (confirmed or in_progress)
            Booking.count({
                where: {
                    booking_status: {
                        [Op.in]: ['confirmed', 'in_progress']
                    }
                }
            }),
            // Pending nurse verifications
            Nurse.count({
                where: { verification_status: 'pending' }
            }),
            // Total users
            User.count(),
            // Total nurses
            Nurse.count(),
            // Total patients
            Patient.count()
        ]);

        return {
            total_revenue: totalRevenue,
            active_bookings: activeBookings,
            pending_verifications: pendingVerifications,
            total_users: totalUsers,
            total_nurses: totalNurses,
            total_patients: totalPatients
        };
    } catch (error) {
        throw new Error(`Failed to get dashboard stats: ${error.message}`);
    }
};

// get analytics data
const getAnalytics = async (period = '30days') => {
    try {
        const now = new Date();
        let startDate;
        
        switch (period) {
            case '7days':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30days':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '90days':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        // Revenue trends
        const revenueTrends = await Payment.findAll({
            where: {
                status: 'successful',
                transaction_date: {
                    [Op.gte]: startDate
                }
            },
            attributes: [
                [fn('DATE', col('transaction_date')), 'date'],
                [fn('SUM', col('amount')), 'total']
            ],
            group: [fn('DATE', col('transaction_date'))],
            order: [[fn('DATE', col('transaction_date')), 'ASC']],
            raw: true
        });

        // Booking status distribution
        const bookingStatusDistribution = await Booking.findAll({
            attributes: [
                'booking_status',
                [fn('COUNT', col('booking_ID')), 'count']
            ],
            group: ['booking_status'],
            raw: true
        });

        // Top nurses by bookings
        const topNurses = await Booking.findAll({
            attributes: [
                'nurse_ID',
                [fn('COUNT', col('booking_ID')), 'booking_count']
            ],
            group: ['nurse_ID'],
            order: [[fn('COUNT', col('booking_ID')), 'DESC']],
            limit: 10,
            raw: true
        });

        // New registrations
        const newRegistrations = await User.findAll({
            where: {
                createdAt: {
                    [Op.gte]: startDate
                }
            },
            attributes: [
                [fn('DATE', col('createdAt')), 'date'],
                [fn('COUNT', col('user_ID')), 'count']
            ],
            group: [fn('DATE', col('createdAt'))],
            order: [[fn('DATE', col('createdAt')), 'ASC']],
            raw: true
        });

        return {
            revenue_trends: revenueTrends,
            booking_status_distribution: bookingStatusDistribution,
            top_nurses: topNurses,
            new_registrations: newRegistrations,
            period
        };
    } catch (error) {
        throw new Error(`Failed to get analytics: ${error.message}`);
    }
};

module.exports = {
    create,
    login,
    update,
    getAll,
    getById,
    deleteAdmin,
    getDashboardStats,
    getAnalytics
};