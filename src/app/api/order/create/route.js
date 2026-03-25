import connectDB from '../../../../dbconfig/dbconfig';
import Order from '../../../../models/order';
import Coupon from '../../../../models/coupon';
import User from '../../../../models/user';
// Order creation no longer requires authentication; frontend may include `userId` or `null`.

export async function POST(request) {
  try {
    await connectDB();
    const orderData = await request.json();

    // Require either a logged-in user or a guestId to associate the order
    if (!orderData.userId && !orderData.guestId) {
      return Response.json({ error: 'Missing userId or guestId' }, { status: 400 });
    }

    // If coupon was applied, increment usedCount
    if (orderData.discount > 0 && orderData.couponCode) {
      const coupon = await Coupon.findOne({ code: orderData.couponCode.toUpperCase() });
      if (coupon) {
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    // Ensure we capture a stable buyer phone when possible.
    // Priority:
    // 1. If `userId` provided and user has `phone`, use that.
    // 2. Else if frontend provided a `buyerPhone` (verified), use that.
    // NOTE: Do NOT overwrite address phone (recipient) — keep recipient's number in `address.phone`.
    try {
      if (orderData.userId) {
        const purchaser = await User.findById(orderData.userId);
        if (purchaser && purchaser.phone) {
          orderData.buyerPhone = purchaser.phone;
        }
      }
      // If still not set, allow frontend to pass `buyerPhone` (for verified guest flows)
      if (!orderData.buyerPhone && orderData.buyerPhoneFromFront) {
        orderData.buyerPhone = orderData.buyerPhoneFromFront;
      }
    } catch (phoneErr) {
      console.error('Error resolving buyer phone:', phoneErr);
    }

    const order = await Order.create(orderData);

    // Send notification to admin
    try {
      const user = await User.findById(orderData.userId);
      const userName = user?.name || orderData.address?.name || 'Customer';
      const productName = orderData.items.map(item => item.name).join(', ');
      const amount = orderData.total;

      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notify/admin`, {
        method: "POST",
        body: JSON.stringify({
          title: "New Order Received",
          body: `${userName} ordered ${productName} for ₹${amount}`,
        }),
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
