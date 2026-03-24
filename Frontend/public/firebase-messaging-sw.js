importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Real Firebase Configuration for Background Messaging
firebase.initializeApp({
    apiKey: "AIzaSyDbYVaJeVWgtEH4QPiyfxS7I6c6LapraFQ",
    authDomain: "ananya-hotel.firebaseapp.com",
    projectId: "ananya-hotel",
    storageBucket: "ananya-hotel.firebasestorage.app",
    messagingSenderId: "949092926737",
    appId: "1:949092926737:web:67d164a26f8cabecaa38b0",
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/logo.png', // Logo path fixed to use your public logo.png
        data: payload.data,
        vibrate: [200, 100, 200],
        tag: payload.notification.title || 'ananya-sync-notif', // Unique tag for de-duplication
        renotify: true // Sound/vibrate on each new update with the same title
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});
