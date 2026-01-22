const Notification = require("../models/notification.model");

// create notification
const create = async (notificationData) => {
    try {
        const notification = await Notification.create(notificationData);
        return notification;
    } catch (error) {
        throw new Error(`Failed to create notification: ${error.message}`);
    }
};

// get unread notifications for a user
const getUnread = async (userId, userType) => {
    try {
        const notifications = await Notification.findAll({
            where: {
                user_ID: userId,
                user_type: userType,
                is_read: false
            },
            order: [['created_at', 'DESC']],
            limit: 50
        });
        return notifications;
    } catch (error) {
        throw new Error(`Failed to get unread notifications: ${error.message}`);
    }
};

// get all notifications for a user
const getAll = async (userId, userType, limit = 50) => {
    try {
        const notifications = await Notification.findAll({
            where: {
                user_ID: userId,
                user_type: userType
            },
            order: [['created_at', 'DESC']],
            limit: parseInt(limit)
        });
        return notifications;
    } catch (error) {
        throw new Error(`Failed to get notifications: ${error.message}`);
    }
};

// mark notification as read
const markAsRead = async (notificationId, userId) => {
    try {
        const notification = await Notification.findByPk(notificationId);
        if (!notification) {
            throw new Error('Notification not found');
        }

        // Verify notification belongs to user
        if (notification.user_ID !== userId) {
            throw new Error('Unauthorized');
        }

        await Notification.update(
            { is_read: true },
            { where: { notification_ID: notificationId } }
        );

        return await Notification.findByPk(notificationId);
    } catch (error) {
        throw new Error(`Failed to mark notification as read: ${error.message}`);
    }
};

// mark all notifications as read for a user
const markAllAsRead = async (userId, userType) => {
    try {
        await Notification.update(
            { is_read: true },
            {
                where: {
                    user_ID: userId,
                    user_type: userType,
                    is_read: false
                }
            }
        );
        return true;
    } catch (error) {
        throw new Error(`Failed to mark all notifications as read: ${error.message}`);
    }
};

// delete notification
const remove = async (notificationId, userId) => {
    try {
        const notification = await Notification.findByPk(notificationId);
        if (!notification) {
            throw new Error('Notification not found');
        }

        // Verify notification belongs to user
        if (notification.user_ID !== userId) {
            throw new Error('Unauthorized');
        }

        await Notification.destroy({
            where: { notification_ID: notificationId }
        });
        return true;
    } catch (error) {
        throw new Error(`Failed to delete notification: ${error.message}`);
    }
};

// get unread count
const getUnreadCount = async (userId, userType) => {
    try {
        const count = await Notification.count({
            where: {
                user_ID: userId,
                user_type: userType,
                is_read: false
            }
        });
        return count;
    } catch (error) {
        throw new Error(`Failed to get unread count: ${error.message}`);
    }
};

module.exports = {
    create,
    getUnread,
    getAll,
    markAsRead,
    markAllAsRead,
    remove,
    getUnreadCount
};
