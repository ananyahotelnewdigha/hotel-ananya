import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Health check for FCM routes
router.get('/ping', (req, res) => {
    res.json({ message: 'FCM Register Route is Healthy' });
});

// Register Web/App FCM Token for Push Notifications
router.post('/register', protect, async (req, res) => {
    const { token, deviceType } = req.body;
    const userId = req.user._id;
    try {
        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Ensure token exists in ONLY ONE field (prevents duplicate notifications)
        const field = deviceType === 'app' ? 'fcmTokenMobile' : 'fcmTokens';
        const otherField = deviceType === 'app' ? 'fcmTokens' : 'fcmTokenMobile';

        // Remove from the other list if exists
        user[otherField].pull(token);

        // Add to the target list (addToSet prevents duplicates in the same list)
        user[field].addToSet(token);

        await user.save();
        console.log(`FCM Token registered for user ${user.name} [${deviceType}] - Token: ${token.substring(0, 10)}...`);

        res.json({ success: true, message: 'Token registered successfully' });
    } catch (error) {
        console.error('FCM Register Error:', error.message);
        res.status(500).json({ message: 'Failed to register FCM token' });
    }
});

export default router;
