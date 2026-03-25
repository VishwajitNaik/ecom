import { NextResponse } from 'next/server';
import connectDB from '../../../../../dbconfig/dbconfig';
import AdminToken from '../../../../../models/adminToken';
import User from '../../../../../models/user';
import { verifyToken, getTokenFromRequest } from '../../../../../lib/verifyToken';

// POST - Manually register a test FCM token for admin (for testing without service worker)
export async function POST(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectDB();

    // Verify user is admin
    const user = await User.findById(decoded.id);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { fcmToken } = await request.json();

    if (!fcmToken) {
      return NextResponse.json({ error: 'FCM token is required' }, { status: 400 });
    }

    // Save the token
    const adminToken = await AdminToken.findOneAndUpdate(
      { userId: user._id, fcmToken },
      { 
        userId: user._id, 
        fcmToken, 
        deviceInfo: 'Manual registration',
        isActive: true 
      },
      { upsert: true, new: true }
    );

    console.log('Manual FCM token saved for admin:', user.name);

    return NextResponse.json({ 
      success: true, 
      message: 'FCM token saved successfully',
      tokenId: adminToken._id,
      adminName: user.name,
    });
  } catch (error) {
    console.error('Error saving manual FCM token:', error);
    return NextResponse.json({ error: 'Failed to save FCM token: ' + error.message }, { status: 500 });
  }
}