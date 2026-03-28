import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

import { sendNotificationToUser } from '../utils/notificationHelper.js';

const router = express.Router();

// Health check for FCM routes
router.get('/ping', (req, res) => {
    res.json({ message: 'FCM Register Route is Healthy' });
});

// Register Web/App FCM Token for Push Notifications
router.post('/register', (req, res, next) => {
    console.log(`DEBUG: Incoming FCM Register request | Body: ${JSON.stringify(req.body)} | Auth: ${req.headers.authorization ? 'Present' : 'Missing'}`);
    next();
}, protect, async (req, res) => {
    const { token, platform } = req.body;
    const userId = req.user._id;
    try {
        if (!token || token.length < 20) {
            return res.status(400).json({ message: 'Valid token is required' });
        }

        // Avoid saving JWT tokens or literal null/undefined strings
        if (token.startsWith('eyJ') || token === 'null' || token === 'undefined') {
            console.warn(`User ${userId} tried to register an invalid token (${token.substring(0, 10)}...). Ignoring.`);
            return res.status(400).json({ message: 'Invalid token format' });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Ensure token exists in ONLY ONE field (prevents duplicate notifications)
        const mobilePlatforms = ['app', 'android', 'ios', 'mobile'];
        const isMobile = mobilePlatforms.includes(platform?.toLowerCase());

        const field = isMobile ? 'fcmTokenMobile' : 'fcmTokens';
        const otherField = isMobile ? 'fcmTokens' : 'fcmTokenMobile';

        // Remove from the other list if exists
        user[otherField].pull(token);

        // Add to the target list (addToSet prevents duplicates in the same list)
        user[field].addToSet(token);

        await user.save();
        console.log(`FCM REGISTRATION -> User: ${user.email} | Platform: ${platform || 'web'} | Field: ${field}`);

        res.json({ success: true, message: `Token registered successfully in ${field}` });
    } catch (error) {
        console.error('FCM Register Error:', error.message);
        res.status(500).json({ message: 'Failed to register FCM token' });
    }
});

/**
 * Test Notification to oneself (Admin tool)
 */
router.post('/test-self', protect, async (req, res) => {
    try {
        const { title = 'Deep Analysis Test', body = 'If you see this, FCM is working perfectly!' } = req.body;

        await sendNotificationToUser(
            req.user._id,
            title,
            body,
            { type: 'test_notification', timestamp: new Date().toISOString() }
        );

        res.json({ success: true, message: 'Test notification triggered. Check your device/browser.' });
    } catch (error) {
        console.error('Test Self Error:', error.message);
        res.status(500).json({ message: 'Failed to trigger test notification' });
    }
});

export default router;

