import express from 'express';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { notifyAdmins, sendNotificationToUser } from '../utils/notificationHelper.js';

const router = express.Router();

// @desc    Submit a new message/feedback
router.post('/', async (req, res) => {
    const { userId, firstName, lastName, email, phone, subject, message } = req.body;

    try {
        const newMessage = await Message.create({
            user: userId || null,
            firstName,
            lastName,
            email,
            phone,
            subject,
            message
        });

        if (newMessage) {
            const isFeedback = subject?.toLowerCase() === 'feedback';
            const notificationTitle = isFeedback ? "New Guest Feedback" : "New Guest Message";
            const notificationBody = isFeedback 
                ? `Valuable feedback received from ${firstName} ${lastName}.` 
                : `New inquiry received from ${firstName} ${lastName} regarding ${subject}.`;

            // PUSH NOTIFICATION: Admin
            await notifyAdmins(
                notificationTitle,
                notificationBody,
                { 
                    subject, 
                    from: email, 
                    type: isFeedback ? 'feedback' : 'inquiry',
                    messageId: newMessage._id.toString()
                }
            );

            // PUSH NOTIFICATION: User (Confirmation)
            if (userId) {
                await sendNotificationToUser(
                    userId,
                    "Message Received",
                    `Thank you for your ${isFeedback ? 'feedback' : 'message'}. We will get back to you soon.`,
                    { type: 'message_confirmation' }
                );
            }
        }

        res.status(201).json({ message: 'Message sent successfully', success: true, data: newMessage });
    } catch (error) {
        console.error('Submit Message Error:', error);
        res.status(500).json({ message: 'Error sending message', success: false });
    }
});

// @desc    Get all messages (Admin)
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find({}).populate('user', 'name email mobile').sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        console.error('Get Messages Error:', error);
        res.status(500).json({ message: 'Error fetching messages' });
    }
});

// @desc    Update message status
router.patch('/:id/status', async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: 'Error updating status' });
    }
});

// @desc    Delete a message
router.delete('/:id', async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.json({ message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting message' });
    }
});

export default router;
