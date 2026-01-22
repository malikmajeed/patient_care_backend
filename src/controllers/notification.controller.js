const notificationService = require("../services/notification.service");

const getUnread = async (req, res) => {
    try {
        const userId = req.user?.user_id;
        const userType = req.user?.user_type;

        if (!userId || !userType) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        const notifications = await notificationService.getUnread(userId, userType);
        res.status(200).json({
            success: true,
            notifications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const getAll = async (req, res) => {
    try {
        const userId = req.user?.user_id;
        const userType = req.user?.user_type;
        const { limit } = req.query;

        if (!userId || !userType) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        const notifications = await notificationService.getAll(userId, userType, limit);
        res.status(200).json({
            success: true,
            notifications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user?.user_id;
        const userType = req.user?.user_type;

        if (!userId || !userType) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        const count = await notificationService.getUnreadCount(userId, userType);
        res.status(200).json({
            success: true,
            count
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.user_id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        const notification = await notificationService.markAsRead(id, userId);
        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            notification
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user?.user_id;
        const userType = req.user?.user_type;

        if (!userId || !userType) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        await notificationService.markAllAsRead(userId, userType);
        res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.user_id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        await notificationService.remove(id, userId);
        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    getUnread,
    getAll,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    remove
};
