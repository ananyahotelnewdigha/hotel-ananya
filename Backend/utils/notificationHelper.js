import admin from '../services/firebaseAdmin.js';
import User from '../models/User.js';

/**
 * Send Push Notification to specific user via their ID
 */
export const sendNotificationToUser = async (userId, title, body, data = {}) => {
    try {
        const user = await User.findById(userId);
        if (!user) return;

        // Combine all tokens for this user and remove duplicates/nulls
        const tokens = [...(user.fcmTokens || []), ...(user.fcmTokenMobile || [])];
        const uniqueTokens = [...new Set(tokens.filter(t => t && t !== 'null' && t !== 'undefined'))];

        if (uniqueTokens.length === 0) return;

        const message = {
            notification: { title, body },
            data: { ...data, click_action: 'FLUTTER_NOTIFICATION_CLICK' }
        };

        const response = await admin.messaging().sendEachForMulticast({
            ...message,
            tokens: uniqueTokens
        });

        console.log(`Notification sent to ${user.name}: ${response.successCount} success`);
    } catch (error) {
        console.error('Error sending notification to user:', error);
    }
};

/**
 * Send Notification to all Admins
 */
export const notifyAdmins = async (title, body, data = {}) => {
    try {
        const admins = await User.find({ role: 'admin' });
        let allTokens = [];

        admins.forEach(adm => {
            allTokens = [...allTokens, ...(adm.fcmTokens || []), ...(adm.fcmTokenMobile || [])];
        });

        const uniqueTokens = [...new Set(allTokens.filter(t => t && t !== 'null' && t !== 'undefined'))];
        if (uniqueTokens.length === 0) return;

        const message = {
            notification: { title, body },
            data: { ...data, role: 'admin' }
        };

        const response = await admin.messaging().sendEachForMulticast({
            ...message,
            tokens: uniqueTokens
        });

        console.log(`Admin notification sent: ${response.successCount} success`);
    } catch (error) {
        console.error('Error notifying admins:', error);
    }
};
