import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
function initializeFirebaseAdmin() {
  if (!admin.apps.length) {
    try {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
      
      if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
        console.warn('Firebase Admin SDK credentials not fully configured');
        return null;
      }

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Firebase Admin initialization error:', error);
      return null;
    }
  }
  return admin;
}

// Get initialized admin instance
export function getFirebaseAdmin() {
  return initializeFirebaseAdmin();
}

// Send notification to a specific FCM token
export async function sendNotificationToToken(token, title, body, data = {}) {
  const adminInstance = getFirebaseAdmin();
  if (!adminInstance) {
    console.error('Firebase Admin not initialized');
    return { success: false, error: 'Firebase Admin not initialized' };
  }

  const message = {
    notification: {
      title,
      body,
    },
    data: {
      ...data,
      click_action: '/admin/orders',
    },
    token,
  };

  try {
    const response = await adminInstance.messaging().send(message);
    console.log('Notification sent successfully:', response);
    return { success: true, messageId: response };
  } catch (error) {
    console.error('Error sending notification:', error);
    return { success: false, error: error.message, code: error.code };
  }
}

// Send notification to all admin tokens
export async function sendNotificationToAllAdmins(title, body, data = {}) {
  const adminInstance = getFirebaseAdmin();
  if (!adminInstance) {
    console.error('Firebase Admin not initialized');
    return { success: false, error: 'Firebase Admin not initialized', results: [] };
  }

  try {
    // Dynamic import to avoid circular dependencies
    const connectDB = (await import('../dbconfig/dbconfig')).default;
    const AdminToken = (await import('../models/adminToken')).default;

    await connectDB();
    const adminTokens = await AdminToken.find({ isActive: true });

    if (adminTokens.length === 0) {
      console.log('No active admin tokens found');
      return { success: true, message: 'No active admin tokens found', results: [] };
    }

    const results = await Promise.all(
      adminTokens.map(async (adminToken) => {
        const result = await sendNotificationToToken(adminToken.fcmToken, title, body, data);
        
        // If token is invalid, mark it as inactive
        if (!result.success && (
          result.code === 'messaging/invalid-registration-token' ||
          result.code === 'messaging/registration-token-not-registered'
        )) {
          await AdminToken.findByIdAndUpdate(adminToken._id, { isActive: false });
        }
        
        return {
          tokenId: adminToken._id,
          ...result,
        };
      })
    );

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return {
      success: true,
      message: `Notifications sent: ${successCount} success, ${failCount} failed`,
      results,
    };
  } catch (error) {
    console.error('Error sending notifications to admins:', error);
    return { success: false, error: error.message, results: [] };
  }
}

// Send order notification to all admins
export async function sendOrderNotificationToAdmins(orderData) {
  const { userName, items, total, paymentMethod, paymentStatus, orderId } = orderData;
  
  const totalQuantity = items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 1;
  
  const title = '🛒 New Order Received!';
  const body = `${userName || 'Customer'} ordered ${totalQuantity} item(s) - ₹${total} (${paymentMethod === 'COD' ? 'Cash on Delivery' : paymentStatus === 'success' ? 'Paid' : 'Payment Pending'})`;
  
  return sendNotificationToAllAdmins(title, body, {
    orderId: orderId?.toString() || '',
    userName: userName || '',
    total: total?.toString() || '0',
    paymentMethod: paymentMethod || '',
    paymentStatus: paymentStatus || '',
    type: 'new_order',
  });
}