import { NextResponse } from 'next/server';
import connectDB from '../../../../dbconfig/dbconfig';
import AdminToken from '../../../../models/adminToken';
import User from '../../../../models/user';
import { verifyToken, getTokenFromRequest } from '../../../../lib/verifyToken';

// POST - Save or update admin FCM token
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

    const { fcmToken, deviceInfo } = await request.json();

    if (!fcmToken) {
      return NextResponse.json({ error: 'FCM token is required' }, { status: 400 });
    }

    // Upsert the token - update if exists, create if not
    const adminToken = await AdminToken.findOneAndUpdate(
      { userId: user._id, fcmToken },
      { 
        userId: user._id, 
        fcmToken, 
        deviceInfo: deviceInfo || 'unknown',
        isActive: true 
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ 
      success: true, 
      message: 'FCM token saved successfully',
      tokenId: adminToken._id 
    });
  } catch (error) {
    console.error('Error saving FCM token:', error);
    return NextResponse.json({ error: 'Failed to save FCM token' }, { status: 500 });
  }
}

// DELETE - Remove FCM token (for logout or unsubscribe)
export async function DELETE(request) {
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

    const { fcmToken } = await request.json();

    if (!fcmToken) {
      return NextResponse.json({ error: 'FCM token is required' }, { status: 400 });
    }

    await AdminToken.findOneAndDelete({ userId: decoded.id, fcmToken });

    return NextResponse.json({ 
      success: true, 
      message: 'FCM token removed successfully' 
    });
  } catch (error) {
    console.error('Error removing FCM token:', error);
    return NextResponse.json({ error: 'Failed to remove FCM token' }, { status: 500 });
  }
}

// GET - Get all active admin tokens (for internal use)
export async function GET(request) {
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

    const tokens = await AdminToken.find({ isActive: true }).populate('userId', 'name email');

    return NextResponse.json({ success: true, tokens });
  } catch (error) {
    console.error('Error fetching FCM tokens:', error);
    return NextResponse.json({ error: 'Failed to fetch FCM tokens' }, { status: 500 });
  }
}