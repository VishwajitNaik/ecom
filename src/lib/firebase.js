import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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

// 🔹 Auth (browser only)
export const auth =
  typeof window !== "undefined" ? getAuth(app) : null;

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
