import connectDB from '../../../../dbconfig/dbconfig';
import Order from '../../../../models/order';
import Coupon from '../../../../models/coupon';
import { verifyToken, getTokenFromRequest } from '../../../../lib/verifyToken';

export async function POST(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = verifyToken(token);
    if (!user) {
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
    return Response.json({ success: true, orderId: order._id });
  } catch (error) {
    return Response.json({ error: 'Failed to create order' }, { status: 500 });
  }
}