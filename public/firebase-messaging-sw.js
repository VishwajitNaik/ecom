// Firebase Messaging Service Worker
// This handles background push notifications

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase configuration - these will be replaced with actual values
const firebaseConfig = {
  apiKey: "AIzaSyDiYSLJHEKdemRZ35ekysI_l1krv1d04M0",
  authDomain: "ecom-admin-notify.firebaseapp.com",
  projectId: "ecom-admin-notify",
  storageBucket: "ecom-admin-notify.firebasestorage.app",
  messagingSenderId: "1063539997640",
  appId: "1:1063539997640:web:0068524dd1358cf8b3defd",
  measurementId: "G-D4E165JG8S"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'New Order!';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new order',
    icon: '/assets/main/logo1.png',
    badge: '/assets/main/logo1.png',
    vibrate: [100, 50, 100],
    data: payload.data || {},
    actions: [
      {
        action: 'view',
        title: 'View Order',
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
      },
    ],
    requireInteraction: true,
    tag: 'order-notification',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click:', event);

  event.notification.close();

  if (event.action === 'view' || !event.action) {
    // Open the admin orders page
    const urlToOpen = '/admin/orders';

    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
        // Check if there's already a window open
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url.includes('/admin') && 'focus' in client) {
            client.navigate(urlToOpen);
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
    );
  }
});

// Handle service worker installation
self.addEventListener('install', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker installed');
  self.skipWaiting();
});

// Handle service worker activation
self.addEventListener('activate', (event) => {
  console.log('[firebase-messaging-sw.js] Service Worker activated');
  event.waitUntil(clients.claim());
});