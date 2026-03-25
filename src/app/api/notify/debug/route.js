import { NextResponse } from 'next/server';
import { getFirebaseAdmin, sendNotificationToAllAdmins } from '../../../../lib/firebaseAdmin';
import connectDB from '../../../../dbconfig/dbconfig';
import AdminToken from '../../../../models/adminToken';

// Debug endpoint to check Firebase Admin status
export async function GET(request) {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    firebaseConfig: {
      projectId: process.env.FIREBASE_PROJECT_ID ? 'SET' : 'MISSING',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL ? 'SET' : 'MISSING',
      privateKey: process.env.FIREBASE_PRIVATE_KEY ? `SET (${process.env.FIREBASE_PRIVATE_KEY.length} chars)` : 'MISSING',
      privateKeyPreview: process.env.FIREBASE_PRIVATE_KEY?.substring(0, 50) + '...',
    },
    firebaseAdmin: null,
    adminTokens: [],
    testNotification: null,
  };

  try {
    // Check Firebase Admin initialization
    const admin = getFirebaseAdmin();
    debugInfo.firebaseAdmin = admin ? 'INITIALIZED' : 'FAILED';

    // Check database connection and admin tokens
    await connectDB();
    const tokens = await AdminToken.find({ isActive: true }).select('fcmToken deviceInfo createdAt');
    debugInfo.adminTokens = tokens.map(t => ({
      id: t._id.toString(),
      tokenPreview: t.fcmToken?.substring(0, 30) + '...',
      deviceInfo: t.deviceInfo,
      createdAt: t.createdAt,
    }));
    debugInfo.tokenCount = tokens.length;

  } catch (error) {
    debugInfo.error = error.message;
  }

  return NextResponse.json(debugInfo);
}

// POST - Send a test notification
export async function POST(request) {
  try {
    const result = await sendNotificationToAllAdmins(
      '🧪 Test Notification',
      'This is a test notification from the debug endpoint',
      { type: 'test', timestamp: new Date().toISOString() }
    );

    return NextResponse.json({
      success: true,
      message: 'Test notification sent',
      result,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}