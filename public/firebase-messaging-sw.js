/* global importScripts, firebase */

// Load Firebase scripts
importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAl22WKBSJzOtOUnNxk2AGOH7zZGMv0HE0",
  authDomain: "varadan-804f6.firebaseapp.com",
  projectId: "varadan-804f6",
  storageBucket: "varadan-804f6.firebasestorage.app",
  messagingSenderId: "1080949280432",
  appId: "1:1080949280432:web:ad1d7c017028ab5d1cb575",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});


// NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAl22WKBSJzOtOUnNxk2AGOH7zZGMv0HE0
// NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=varadan-804f6.firebaseapp.com
// NEXT_PUBLIC_FIREBASE_PROJECT_ID=varadan-804f6
// NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=varadan-804f6.firebasestorage.app
// NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1080949280432
// NEXT_PUBLIC_FIREBASE_APP_ID=1:1080949280432:web:ad1d7c017028ab5d1cb575
// NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-B7E1EWHN1X
