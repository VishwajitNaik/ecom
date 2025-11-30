import connectDB from '../../../../dbconfig/dbconfig';
import Order from '../../../../models/order';
import Coupon from '../../../../models/coupon';
import User from '../../../../models/user';
import { verifyToken, getTokenFromRequest } from '../../../../lib/verifyToken';
import { sendOrderNotificationToAdmins } from '../../../../lib/firebaseAdmin';

export async function POST(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userData = verifyToken(token);
    if (!userData) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectDB();
    const orderData = await request.json();

    // If coupon was applied, increment usedCount
    if (orderData.discount > 0 && orderData.couponCode) {
      const coupon = await Coupon.findOne({ code: orderData.couponCode.toUpperCase() });
      if (coupon) {
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    const order = await Order.create(orderData);

    // Send notification to admin
    try {
      // Get user name for notification
      const user = await User.findById(orderData.userId);
      const userName = user?.name || orderData.address?.name || 'Customer';
      
      await sendOrderNotificationToAdmins({
        orderId: order._id,
        userName,
        items: orderData.items,
        total: orderData.total,
        paymentMethod: orderData.paymentMethod,
        paymentStatus: orderData.paymentStatus || 'pending',
      });
    } catch (notifyError) {
      console.error('Failed to send order notification:', notifyError);
      // Don't fail the order creation if notification fails
    }

    return Response.json({ success: true, orderId: order._id });
  } catch (error) {
    console.error('Order creation error:', error);
    return Response.json({ error: 'Failed to create order' }, { status: 500 });
  }
}