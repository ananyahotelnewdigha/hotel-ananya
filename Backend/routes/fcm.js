import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Health check for FCM routes
router.get('/ping', (req, res) => {
    res.json({ message: 'FCM Register Route is Healthy' });
});

// Register Web/App FCM Token for Push Notifications
router.post('/register', async (req, res) => {
    const { userId, token, deviceType } = req.body;
    try {
        if (!userId || !token) {
            return res.status(400).json({ message: 'UserId and Token are required' });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Add token if not exists (prevent duplicates)
        const field = deviceType === 'app' ? 'fcmTokenMobile' : 'fcmTokens';

        if (!user[field].includes(token)) {
            user[field].push(token);
            await user.save();
            console.log(`FCM Token registered for user ${user.name} [${deviceType}] - Token: ${token.substring(0, 10)}...`);
        } else {
            console.log(`FCM Token already exists for user ${user.name} [${deviceType}]`);
        }

        res.json({ success: true, message: 'Token registered successfully' });
    } catch (error) {
        console.error('FCM Register Error:', error.message);
        res.status(500).json({ message: 'Failed to register FCM token' });
    }
});

export default router;
