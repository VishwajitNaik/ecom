import { NextResponse } from 'next/server';
import { sendOrderNotificationToAdmins } from '../../../../lib/firebaseAdmin';

export async function POST(request) {
  try {
    const { orderId, userName, total, items } = await request.json();

    const result = await sendOrderNotificationToAdmins({
      orderId: orderId || 'TEST_ORDER_123',
      userName: userName || 'Test User',
      items: items || [{ name: 'Test Product', quantity: 1 }],
      total: total || 999,
      paymentMethod: 'COD',
      paymentStatus: 'success',
    });

    return NextResponse.json({
      success: true,
      message: 'Test notification sent',
      result
    });
  } catch (error) {
    console.error('Test notification error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
