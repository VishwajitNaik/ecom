import { NextResponse } from 'next/server';
import connectDB from '../../../../dbconfig/dbconfig';
import AdminToken from '../../../../models/adminToken';
import { sendOrderNotificationToAdmins } from '../../../../lib/firebaseAdmin';

// GET - Test endpoint to check admin tokens and send test notification
export async function GET(request) {
  try {
    await connectDB();
    
    // Get all admin tokens
    const adminTokens = await AdminToken.find({}).populate('userId', 'name email role');
    
    return NextResponse.json({
      success: true,
      message: 'Admin tokens retrieved',
      count: adminTokens.length,
      tokens: adminTokens.map(t => ({
        id: t._id,
        userId: t.userId?._id,
        userName: t.userId?.name,
        userRole: t.userId?.role,
        isActive: t.isActive,
        deviceInfo: t.deviceInfo?.substring(0, 50) + '...',
        createdAt: t.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching admin tokens:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Send a test notification
export async function POST(request) {
  try {
    const body = await request.json();
    const { userName = 'Test User', total = 999, paymentMethod = 'COD' } = body;
    
    console.log('Sending test notification...');
    
    const result = await sendOrderNotificationToAdmins({
      orderId: 'TEST-' + Date.now(),
      userName,
      items: [{ name: 'Test Product', quantity: 1 }],
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'pending' : 'success',
    });
    
    console.log('Test notification result:', result);
    
    return NextResponse.json({
      success: true,
      message: 'Test notification sent',
      result,
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}