// lib/generateFCMToken.js

import { getMessaging, getToken } from "firebase/messaging";
import { app } from "./firebase";

export async function generateAndSaveFCMToken() {
  try {
    // Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    // Register service worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    await navigator.serviceWorker.ready;

    const messaging = getMessaging(app);

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.log("No FCM token generated");
      return null;
    }

    console.log("✅ NEW FCM TOKEN:", token);

    // Save to backend
    const authToken = localStorage.getItem("token");
    const response = await fetch("/api/admin/fcm-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        fcmToken: token,
        deviceInfo: navigator.userAgent,
      }),
    });

    if (response.ok) {
      return token;
    } else {
      console.error("Failed to save FCM token to backend");
      return null;
    }
  } catch (err) {
    console.error("FCM token error:", err);
    return null;
  }
}
