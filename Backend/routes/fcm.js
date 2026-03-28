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
router.post('/register', protect, async (req, res) => {
    const { token, platform } = req.body;
    const userId = req.user._id;
    try {
        if (!token || token.length < 20) {
            return res.status(400).json({ message: 'Valid token is required' });
        }

        // Avoid saving JWT tokens (accidental misconfigurations)
        if (token.startsWith('eyJ')) {
            console.warn(`User ${userId} tried to register a JWT as an FCM token. Ignoring.`);
            return res.status(400).json({ message: 'Invalid token format (JWT detected)' });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Ensure token exists in ONLY ONE field (prevents duplicate notifications)
        const field = platform === 'app' ? 'fcmTokenMobile' : 'fcmTokens';
        const otherField = platform === 'app' ? 'fcmTokens' : 'fcmTokenMobile';

        // Remove from the other list if exists
        user[otherField].pull(token);

        // Add to the target list (addToSet prevents duplicates in the same list)
        user[field].addToSet(token);

        await user.save();
        console.log(`FCM Token registered for user ${user.name} [${platform}] - Token: ${token.substring(0, 10)}...`);

        res.json({ success: true, message: 'Token registered successfully' });
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

