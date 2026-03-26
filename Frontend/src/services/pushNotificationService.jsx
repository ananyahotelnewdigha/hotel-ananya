import { messaging } from "../firebase";
import { getToken, onMessage } from "firebase/messaging";
import axios from "axios";

/**
 * Request notification permission and get token
 */
export const requestPermissionAndGetToken = async (userId) => {
    try {
        if (!('Notification' in window)) {
            console.warn('This browser does not support notifications.');
            return null;
        }

        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const token = await getToken(messaging, {
                vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
            });

            if (token) {
                console.log('FCM Token Generated:', token);

                const savedToken = localStorage.getItem('fcmToken');
                if (savedToken !== token) {
                    localStorage.setItem('fcmToken', token);
                    await registerTokenWithBackend(userId, token);
                }

                // Initialize foreground native pusher
                setupForegroundListener();

                return token;
            } else {
                console.warn('No FCM token obtained.');
                return null;
            }
        } else {
            console.warn('Notification permission denied.');
            return null;
        }
    } catch (error) {
        console.error('Push Notification Setup Failed:', error);
        return null;
    }
};

/**
 * Handle messages when the app is in foreground and show NATIVE notification
 */
export const setupForegroundListener = () => {
    onMessage(messaging, (payload) => {
        console.log('Foreground Message Received:', payload);

        // Use Native Browser Notification API for foreground
        if (Notification.permission === 'granted') {
            const notificationTitle = payload.notification.title;
            const notificationOptions = {
                body: payload.notification.body,
                icon: '/logo.png', // Logo fixed
                data: payload.data,
                tag: payload.fcmOptions?.link || 'hotel-ananya-sync', // Unique tag for de-duplication
                renotify: true // Still notify user if new content arrives with same tag
            };

            // Trigger standard OS notification
            new Notification(notificationTitle, notificationOptions);
        }
    });
};

/**
 * Logic to register the token with the backend
 */
const registerTokenWithBackend = async (userId, token) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/fcm/register`, {
            userId,
            token,
            platform: 'web'
        });
        if (response.data.success) {
            console.log('Web FCM Token successfully registered in Database for user:', userId);
        }
    } catch (error) {
        console.error('Error registering token with backend:', error.message);
    }
};
