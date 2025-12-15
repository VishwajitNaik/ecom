// import { initializeApp, getApps } from 'firebase/app';
// import { getMessaging, getToken, onMessage } from 'firebase/messaging';
// import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
// };

// // Initialize Firebase
// let app;
// if (!getApps().length) {
//   app = initializeApp(firebaseConfig);
// } else {
//   app = getApps()[0];
// }

// // Get messaging instance (only in browser)
// let messaging = null;

// if (typeof window !== 'undefined') {
//   // Initialize Firebase App Check
//   const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
//   if (recaptchaSiteKey) {
//     initializeAppCheck(app, {
//       provider: new ReCaptchaV3Provider(recaptchaSiteKey),
//       isTokenAutoRefreshEnabled: true,
//     });
//   } else {
//     console.warn('NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set. Firebase App Check will not be initialized.');
//   }
// }

// export const initializeFirebaseMessaging = async () => {
//   if (typeof window === 'undefined') {
//     return null;
//   }

//   try {
//     // Check if notifications are supported
//     if (!('Notification' in window)) {
//       console.log('This browser does not support notifications');
//       return null;
//     }

//     // Check if service workers are supported
//     if (!('serviceWorker' in navigator)) {
//       console.log('Service workers are not supported');
//       return null;
//     }

//     const { getMessaging } = await import('firebase/messaging');
//     messaging = getMessaging(app);
//     return messaging;
//   } catch (error) {
//     console.error('Error initializing Firebase Messaging:', error);
//     return null;
//   }
// };

// // Request notification permission and get FCM token
// export const requestNotificationPermission = async () => {
//   if (typeof window === 'undefined') {
//     return null;
//   }

//   try {
//     // Request permission
//     const permission = await Notification.requestPermission();
    
//     if (permission !== 'granted') {
//       console.log('Notification permission denied');
//       return null;
//     }

//     // Register service worker
//     const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
//     console.log('Service Worker registered:', registration);

//     // Wait for service worker to be ready
//     await navigator.serviceWorker.ready;

//     // Initialize messaging if not already done
//     if (!messaging) {
//       await initializeFirebaseMessaging();
//     }

//     if (!messaging) {
//       console.error('Messaging not initialized');
//       return null;
//     }

//     // Get FCM token
//     const { getToken } = await import('firebase/messaging');
//     const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    
//     const token = await getToken(messaging, {
//       vapidKey,
//       serviceWorkerRegistration: registration,
//     });

//     if (token) {
//       console.log('FCM Token obtained:', token);
//       return token;
//     } else {
//       console.log('No FCM token available');
//       return null;
//     }
//   } catch (error) {
//     console.error('Error getting FCM token:', error);
//     return null;
//   }
// };

// // Listen for foreground messages
// export const onForegroundMessage = (callback) => {
//   if (typeof window === 'undefined' || !messaging) {
//     return () => {};
//   }

//   return onMessage(messaging, (payload) => {
//     console.log('Foreground message received:', payload);
//     callback(payload);
//   });
// };

// // Save FCM token to backend
// export const saveFcmTokenToBackend = async (fcmToken, authToken) => {
//   try {
//     const deviceInfo = navigator.userAgent;
    
//     const response = await fetch('/api/admin/fcm-token', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${authToken}`,
//       },
//       body: JSON.stringify({
//         fcmToken,
//         deviceInfo,
//       }),
//     });

//     const data = await response.json();
    
//     if (data.success) {
//       console.log('FCM token saved to backend');
//       return true;
//     } else {
//       console.error('Failed to save FCM token:', data.error);
//       return false;
//     }
//   } catch (error) {
//     console.error('Error saving FCM token to backend:', error);
//     return false;
//   }
// };

// // Remove FCM token from backend (for logout)
// export const removeFcmTokenFromBackend = async (fcmToken, authToken) => {
//   try {
//     const response = await fetch('/api/admin/fcm-token', {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${authToken}`,
//       },
//       body: JSON.stringify({ fcmToken }),
//     });

//     const data = await response.json();
//     return data.success;
//   } catch (error) {
//     console.error('Error removing FCM token:', error);
//     return false;
//   }
// };

// export { app, messaging };

import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, onMessage, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 🔹 Initialize Firebase once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// 🔹 Messaging (browser only)
export const messaging =
  typeof window !== "undefined" ? getMessaging(app) : null;

/* ================= FCM Helpers ================= */

// Request notification permission + get token
export const requestNotificationPermission = async () => {
  if (typeof window === "undefined" || !messaging) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    return token || null;
  } catch (err) {
    console.error("FCM permission error:", err);
    return null;
  }
};

// Foreground message listener
export const onForegroundMessage = (callback) => {
  if (!messaging) return () => {};
  return onMessage(messaging, callback);
};

// Save FCM token to backend
export const saveFcmTokenToBackend = async (fcmToken, authToken) => {
  try {
    const deviceInfo = navigator.userAgent;

    const response = await fetch('/api/admin/fcm-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        fcmToken,
        deviceInfo,
      }),
    });

    const data = await response.json();

    if (data.success) {
      console.log('FCM token saved to backend');
      return true;
    } else {
      console.error('Failed to save FCM token:', data.error);
      return false;
    }
  } catch (error) {
    console.error('Error saving FCM token to backend:', error);
    return false;
  }
};

// Remove FCM token from backend (for logout)
export const removeFcmTokenFromBackend = async (fcmToken, authToken) => {
  try {
    const response = await fetch('/api/admin/fcm-token', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ fcmToken }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error removing FCM token:', error);
    return false;
  }
};

export { app };
