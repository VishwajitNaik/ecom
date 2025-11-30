'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  requestNotificationPermission,
  saveFcmTokenToBackend,
  initializeFirebaseMessaging,
  onForegroundMessage
} from '../lib/firebase';

export default function AdminNotifications() {
  const [notificationStatus, setNotificationStatus] = useState('idle'); // idle, requesting, granted, denied, error
  const [fcmToken, setFcmToken] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', body: '' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  const showNotificationToast = useCallback((title, body) => {
    setToastMessage({ title, body });
    setShowToast(true);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 5000);

    // Play notification sound
    try {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch (e) {
      // Ignore audio errors
    }
  }, []);

  const registerForNotifications = useCallback(async () => {
    setNotificationStatus('requesting');
    
    try {
      const token = await requestNotificationPermission();
      
      if (token) {
        setFcmToken(token);
        setNotificationStatus('granted');
        
        // Save token to backend
        const authToken = localStorage.getItem('token');
        if (authToken) {
          await saveFcmTokenToBackend(token, authToken);
        }
        
        // Store token locally for reference
        localStorage.setItem('fcmToken', token);
      } else {
        setNotificationStatus('denied');
      }
    } catch (error) {
      console.error('Error registering for notifications:', error);
      setNotificationStatus('error');
    }
  }, []);

  useEffect(() => {
    // Check if user is admin
    const checkAndRegister = async () => {
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        setDebugInfo('No auth token found');
        return;
      }

      try {
        // Decode token to check role (simple base64 decode of payload)
        const payload = JSON.parse(atob(authToken.split('.')[1]));
        console.log('User payload:', payload);
        setDebugInfo(`User role: ${payload.role}`);
        
        if (payload.role !== 'admin') {
          setDebugInfo('Not an admin user');
          return;
        }
        
        setIsAdmin(true);
        setDebugInfo('Admin user detected, checking notifications...');

        // Check if already registered
        const existingToken = localStorage.getItem('fcmToken');
        
        // Initialize messaging
        console.log('Initializing Firebase Messaging...');
        const messaging = await initializeFirebaseMessaging();
        console.log('Messaging initialized:', !!messaging);
        setDebugInfo(prev => prev + '\nMessaging: ' + (messaging ? 'OK' : 'Failed'));
        
        // Check notification permission status
        const permission = typeof Notification !== 'undefined' ? Notification.permission : 'unsupported';
        console.log('Notification permission:', permission);
        setDebugInfo(prev => prev + '\nPermission: ' + permission);
        
        if (permission === 'granted' && existingToken) {
          setFcmToken(existingToken);
          setNotificationStatus('granted');
          setDebugInfo(prev => prev + '\nExisting token found, re-saving...');
          
          // Re-save token to ensure it's in the database
          const saved = await saveFcmTokenToBackend(existingToken, authToken);
          setDebugInfo(prev => prev + '\nToken saved: ' + saved);
        } else if (permission === 'default') {
          setDebugInfo(prev => prev + '\nWill request permission...');
          // Auto-request permission for admin users
          await registerForNotifications();
        } else if (permission === 'denied') {
          setNotificationStatus('denied');
          setDebugInfo(prev => prev + '\nNotifications denied by user');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setDebugInfo(prev => prev + '\nError: ' + error.message);
      }
    };

    checkAndRegister();
  }, [registerForNotifications]);

  // Listen for foreground messages
  useEffect(() => {
    let unsubscribe = () => {};

    const setupForegroundListener = async () => {
      await initializeFirebaseMessaging();
      
      const { onMessage } = await import('firebase/messaging');
      const { getMessaging } = await import('firebase/messaging');
      const { getApps } = await import('firebase/app');
      
      if (getApps().length > 0) {
        try {
          const messaging = getMessaging();
          unsubscribe = onMessage(messaging, (payload) => {
            console.log('Foreground message:', payload);
            showNotificationToast(
              payload.notification?.title || 'New Notification',
              payload.notification?.body || ''
            );
          });
        } catch (error) {
          console.error('Error setting up foreground listener:', error);
        }
      }
    };

    if (typeof window !== 'undefined' && Notification.permission === 'granted') {
      setupForegroundListener();
    }

    return () => unsubscribe();
  }, [showNotificationToast]);

  // Don't render anything if not admin or notifications not supported
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <>
      {/* Notification Permission Banner */}
      {notificationStatus === 'denied' && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm">
          <div className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium">Notifications Blocked</p>
              <p className="text-sm">Enable notifications in your browser settings to receive order alerts.</p>
            </div>
          </div>
        </div>
      )}

      {/* Notification Status Indicator */}
      {notificationStatus === 'granted' && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-800 px-3 py-2 rounded-lg shadow-lg z-40 text-sm flex items-center">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
          Notifications Active
        </div>
      )}

      {/* Foreground Notification Toast */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-2xl z-50 max-w-sm animate-slide-in">
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{toastMessage.title}</p>
                <p className="mt-1 text-sm text-gray-500">{toastMessage.body}</p>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="mt-3">
              <a
                href="/admin/orders"
                className="text-sm font-medium text-green-600 hover:text-green-500"
              >
                View Orders →
              </a>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}