import connectDB from '../../../../dbconfig/dbconfig';
import Order from '../../../../models/order';
import Review from '../../../../models/review';
import { verifyToken, getTokenFromRequest } from '../../../../lib/verifyToken';

export async function POST(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return Response.json({ canReview: false, reason: 'Not authenticated' });
    }

    const user = verifyToken(token);
    if (!user) {
      return Response.json({ canReview: false, reason: 'Invalid token' });
    }

    await connectDB();
    const { productId } = await request.json();
    console.log('Checking review eligibility for user:', user.id, 'product:', productId);

    // First, let's see all orders for this user
    const allUserOrders = await Order.find({ userId: user.id });
    console.log('All orders for user:', allUserOrders.map(o => ({
      id: o._id,
      status: o.orderStatus,
      items: o.items.map(i => ({ itemId: i.itemId, itemType: i.itemType }))
    })));

    // Check if user has purchased and received the product
    const order = await Order.findOne({
      userId: user.id,
      'items.itemId': productId,
      orderStatus: { $regex: /^delivered$/i } // Case-insensitive match
    });

    console.log('Specific order query result:', !!order);
    if (order) {
      console.log('Order details:', {
        id: order._id,
        status: order.orderStatus,
        items: order.items.map(item => ({
          itemId: item.itemId,
          itemType: item.itemType,
          quantity: item.quantity
        }))
      });

      // Check if this order contains the product we're looking for
      const hasProduct = order.items.some(item => item.itemId.toString() === productId);
      console.log('Order contains target product:', hasProduct);
    } else {
      console.log('No order found with criteria:', {
        userId: user.id,
        'items.itemId': productId,
        orderStatus: 'delivered (case-insensitive)'
      });
    }

    if (!order) {
      return Response.json({
        canReview: false,
        reason: 'You must purchase and receive this product before reviewing'
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      userId: user.id,
      productId: productId
    });

    console.log('Existing review:', !!existingReview);

    if (existingReview) {
      return Response.json({
        canReview: false,
        reason: 'You have already reviewed this product'
      });
    }

    console.log('User can review this product');
    return Response.json({
      canReview: true,
      message: 'You can review this product'
    });

  } catch (error) {
    console.error('Error checking review eligibility:', error);
    return Response.json({
      canReview: false,
      reason: 'Failed to check review eligibility'
    }, { status: 500 });
  }
}