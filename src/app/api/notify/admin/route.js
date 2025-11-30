import { NextResponse } from 'next/server';
import admin from 'firebase-admin';
import connectDB from '../../../../dbconfig/dbconfig';
import AdminToken from '../../../../models/adminToken';

// Initialize Firebase Admin SDK
function initializeFirebaseAdmin() {
  if (!admin.apps.length) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Firebase Admin initialization error:', error);
    }
  }
}

// Initialize on module load
initializeFirebaseAdmin();

// Send notification to a specific token
async function sendNotification(token, title, body, data = {}) {
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
    const response = await admin.messaging().send(message);
    console.log('Notification sent successfully:', response);
    return { success: true, messageId: response };
  } catch (error) {
    console.error('Error sending notification:', error);
    // If token is invalid, mark it as inactive
    if (error.code === 'messaging/invalid-registration-token' || 
        error.code === 'messaging/registration-token-not-registered') {
      await AdminToken.findOneAndUpdate({ fcmToken: token }, { isActive: false });
    }
    return { success: false, error: error.message };
  }
}

// POST - Send notification to all admin devices
export async function POST(request) {
  try {
    const { title, body, data, token: singleToken } = await request.json();

    if (!title || !body) {
      return NextResponse.json({ error: 'Title and body are required' }, { status: 400 });
    }

    // If a specific token is provided, send to that token only
    if (singleToken) {
      const result = await sendNotification(singleToken, title, body, data);
      return NextResponse.json(result);
    }

    // Otherwise, send to all active admin tokens
    await connectDB();
    const adminTokens = await AdminToken.find({ isActive: true });

    if (adminTokens.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'No active admin tokens found' 
      });
    }

    const results = await Promise.all(
      adminTokens.map(async (adminToken) => {
        const result = await sendNotification(adminToken.fcmToken, title, body, data);
        return {
          tokenId: adminToken._id,
          ...result,
        };
      })
    );

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: true,
      message: `Notifications sent: ${successCount} success, ${failCount} failed`,
      results,
    });
  } catch (error) {
    console.error('Error in notify admin:', error);
    return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 });
  }
}