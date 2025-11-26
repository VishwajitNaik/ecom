import connectDB from '../../../../dbconfig/dbconfig';
import Order from '../../../../models/order';
import { verifyToken, getTokenFromRequest } from '../../../../lib/verifyToken';

export async function GET(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = verifyToken(token);
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    await connectDB();
    const orders = await Order.find({})
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(50);

    return Response.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return Response.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = verifyToken(token);
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { orderId, orderStatus } = await request.json();

    await connectDB();
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    ).populate('userId', 'name email phone');

    if (!updatedOrder) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    return Response.json({
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return Response.json({ error: 'Failed to update order' }, { status: 500 });
  }
}