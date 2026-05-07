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
    const tokenStr = String(token || '').trim();
    const userId = req.user._id;
    const userAgent = req.headers['user-agent'] || '';

    // Log basic registration attempt
    console.log(`[FCM REGISTER ATTEMPT] User: ${req.user.email} | Platform Received: ${platform || 'NONE'} | UA: ${userAgent.substring(0, 40)} | Token start: ${tokenStr.substring(0, 15) || 'NULL'}`);

    try {
        // FCM tokens are typically long strings without spaces
        if (!tokenStr || tokenStr.length < 50 || tokenStr.includes(' ')) {
            console.warn(`[FCM REJECTED - LENGTH] Token too short or has spaces. Length: ${tokenStr.length} | User: ${req.user.email}`);
            return res.status(400).json({ message: 'Valid token is required' });
        }

        // Avoid saving JWT tokens or literal null/undefined strings
        // NOTE: Removed 'eyJ' from invalidStarts since some FCM tokens can start with it
        const invalidStarts = ['TEST_', 'mock_', 'Bearer '];
        const isLiteralNull = tokenStr.toLowerCase() === 'null' || tokenStr.toLowerCase() === 'undefined';
        // Detect if this looks like a JWT (3 parts separated by dots, all base64)
        const looksLikeJWT = tokenStr.split('.').length === 3 && tokenStr.startsWith('eyJ');

        if (invalidStarts.some(start => tokenStr.startsWith(start)) || isLiteralNull || looksLikeJWT) {
            console.warn(`[FCM REJECTED - FORMAT] Invalid token format for user ${req.user.email} (starts: ${tokenStr.substring(0, 10)}...). looksLikeJWT: ${looksLikeJWT}`);
            return res.status(400).json({ message: 'Invalid token format' });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Determine platform: use provided value first, then auto-detect from User-Agent
        const mobilePlatforms = ['app', 'android', 'ios', 'mobile', 'flutter', 'dart'];
        let detectedPlatform = platform?.toLowerCase();

        if (!detectedPlatform || !mobilePlatforms.includes(detectedPlatform)) {
            // Auto-detect from User-Agent if platform not explicitly set
            const ua = userAgent.toLowerCase();
            if (ua.includes('android') || ua.includes('flutter') || ua.includes('dart')) {
                detectedPlatform = 'android';
                console.log(`[FCM AUTO-DETECT] Detected mobile from User-Agent for user: ${req.user.email}`);
            } else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ios')) {
                detectedPlatform = 'ios';
                console.log(`[FCM AUTO-DETECT] Detected iOS from User-Agent for user: ${req.user.email}`);
            }
        }

        const isMobile = mobilePlatforms.includes(detectedPlatform);

        const field = isMobile ? 'fcmTokenMobile' : 'fcmTokens';
        const otherField = isMobile ? 'fcmTokens' : 'fcmTokenMobile';

        // Remove from the other list if exists
        user[otherField].pull(token);

        // Add to the target list (addToSet prevents duplicates in the same list)
        user[field].addToSet(token);

        await user.save();

        // Return success and explicit logging
        console.log(`[FCM SUCCESS] User: ${user.email} | Saved in: ${field} | Tokens in field: ${user[field].length}`);

        res.json({
            success: true,
            message: `Token registered in ${field}`,
            field: field,
            tokens_count: user[field].length
        });
    } catch (error) {
        console.error('[FCM ERROR] Registration Logic Failed:', error.message);
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

