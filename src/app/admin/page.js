"use client";

import { useEffect, useState } from "react";
import { messaging } from "../../lib/firebase";
import { getToken, onMessage } from "firebase/messaging";
import { getUserFromToken } from "../../lib/getUser";
import { generateAndSaveFCMToken } from "../../lib/generateFCMToken";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [fcmStatus, setFcmStatus] = useState('checking');
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const checkAdminAccess = async () => {
      const currentUser = getUserFromToken();
      if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = '/';
        return;
      }
      setUser(currentUser);
      setupFCM();
    };

    checkAdminAccess();
  }, []);

  const setupFCM = async () => {
    try {
      console.log("Starting FCM setup...");

      // Clear any cached FCM tokens first
      localStorage.removeItem('fcmToken');
      localStorage.removeItem('fcmTokenTimestamp');

      // Check if browser supports notifications
      if (!('Notification' in window)) {
        setFcmStatus('unsupported');
        console.log("This browser does not support notifications");
        return;
      }

      // Check if service workers are supported
      if (!('serviceWorker' in navigator)) {
        setFcmStatus('nosw');
        console.log("Service workers not supported");
        return;
      }

      // Generate and save FCM token
      const token = await generateAndSaveFCMToken();

      if (token) {
        setFcmStatus('registered');
        // Cache the token locally
        localStorage.setItem('fcmToken', token);
        localStorage.setItem('fcmTokenTimestamp', Date.now().toString());
        console.log("FCM setup completed successfully");
      } else {
        setFcmStatus('failed');
        console.log("Failed to generate and save FCM token");
        return;
      }

      // Listen for foreground messages
      onMessage(messaging, (payload) => {
        console.log("Message received in foreground: ", payload);

        // Show browser notification
        if (Notification.permission === 'granted') {
          new Notification(payload.notification?.title || 'New Notification', {
            body: payload.notification?.body || '',
            icon: '/favicon.ico',
          });
        }

        // Update notification count
        setNotificationCount(prev => prev + 1);
      });

    } catch (err) {
      console.error("FCM setup error:", err);
      setFcmStatus('error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'registered': return 'text-green-600';
      case 'checking': return 'text-yellow-600';
      case 'denied': return 'text-red-600';
      case 'failed': return 'text-red-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'registered': return '✅ FCM Token Registered';
      case 'checking': return '⏳ Checking FCM Status...';
      case 'denied': return '❌ Notifications Denied';
      case 'failed': return '❌ FCM Registration Failed';
      case 'error': return '❌ FCM Setup Error';
      default: return 'Unknown Status';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back, {user.name || 'Admin'}!
              </p>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${getStatusColor(fcmStatus)}`}>
                {getStatusText(fcmStatus)}
              </div>
              {notificationCount > 0 && (
                <div className="mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {notificationCount} notification{notificationCount !== 1 ? 's' : ''} received
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <a
            href="/admin/products"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 group"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">Products</h3>
                <p className="text-gray-600 text-sm">Manage products & packs</p>
              </div>
            </div>
          </a>

          <a
            href="/admin/orders"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 group"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors duration-300">
                <span className="text-2xl">🛒</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">Orders</h3>
                <p className="text-gray-600 text-sm">View all orders</p>
              </div>
            </div>
          </a>

          <a
            href="/admin/users"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 group"
          >
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-300">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">Users</h3>
                <p className="text-gray-600 text-sm">Manage user accounts</p>
              </div>
            </div>
          </a>
        </div>

        {/* FCM Status Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Notification Setup
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Browser Notifications:</span>
              <span className={`font-medium ${Notification.permission === 'granted' ? 'text-green-600' : 'text-red-600'}`}>
                {Notification.permission === 'granted' ? '✅ Enabled' : '❌ Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">FCM Token Status:</span>
              <span className={`font-medium ${getStatusColor(fcmStatus)}`}>
                {getStatusText(fcmStatus)}
              </span>
            </div>

            {/* Test Notification Button */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/notify/test', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                      },
                      body: JSON.stringify({
                        userName: user.name || 'Admin',
                        total: 999,
                        items: [{ name: 'Test Product', quantity: 1 }],
                      }),
                    });

                    const result = await response.json();
                    if (response.ok) {
                      alert('✅ Test notification sent successfully!');
                    } else {
                      alert(`❌ Test notification failed: ${result.error}`);
                    }
                  } catch (error) {
                    alert(`❌ Error: ${error.message}`);
                  }
                }}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
                disabled={fcmStatus !== 'registered'}
              >
                🔔 Send Test Notification
              </button>
            </div>

            {fcmStatus === 'denied' && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Notifications are disabled. Please enable notifications in your browser settings to receive order notifications.
                </p>
              </div>
            )}
            {fcmStatus === 'failed' && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  Failed to register for notifications. Please check your internet connection and try refreshing the page.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
