import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function cleanupDb() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        // Remove JWT-like strings (starting with eyJ) from all FCM token fields
        const users = await User.find({
            $or: [
                { fcmTokens: { $regex: /^eyJ/ } },
                { fcmTokenMobile: { $regex: /^eyJ/ } }
            ]
        });

        console.log(`Found ${users.length} users with corrupted tokens.`);

        for (const user of users) {
            const oldWeb = user.fcmTokens.length;
            const oldMob = user.fcmTokenMobile.length;

            user.fcmTokens = user.fcmTokens.filter(t => !t.startsWith('eyJ'));
            user.fcmTokenMobile = user.fcmTokenMobile.filter(t => !t.startsWith('eyJ'));

            await user.save();
            console.log(`Cleaned ${user.email}: Web Removed: ${oldWeb - user.fcmTokens.length}, Mobile Removed: ${oldMob - user.fcmTokenMobile.length}`);
        }

        await mongoose.disconnect();
        console.log('Cleanup finished.');
    } catch (err) {
        console.error(err);
    }
}

cleanupDb();
