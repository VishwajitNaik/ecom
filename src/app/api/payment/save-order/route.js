import connectDB from '../../../../dbconfig/dbconfig';
import Order from '../../../../models/order';
import User from '../../../../models/user';
import { sendOrderNotificationToAdmins } from '../../../../lib/firebaseAdmin';

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const order = await Order.create(body);

    // Send notification to admin
    try {
      // Get user name for notification
      const user = await User.findById(body.userId);
      const userName = user?.name || body.address?.name || 'Customer';
      
      await sendOrderNotificationToAdmins({
        orderId: order._id,
        userName,
        items: body.items,
        total: body.total,
        paymentMethod: body.paymentMethod,
        paymentStatus: body.paymentStatus || 'success',
      });
    } catch (notifyError) {
      console.error('Failed to send order notification:', notifyError);
      // Don't fail the order creation if notification fails
    }

    return Response.json({ success: true, order });
  } catch (error) {
    console.error('Save order error:', error);
    return Response.json({ success: false, error: 'Failed to save order' }, { status: 500 });
  }
}