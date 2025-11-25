import connectDB from '../../../../dbconfig/dbconfig';
import User from '../../../../models/user';
import Order from '../../../../models/order';
import Product from '../../../../models/products'; // Import to register the model
import { verifyToken, getTokenFromRequest } from '../../../../lib/verifyToken';

export async function GET(request, { params }) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const adminUser = verifyToken(token);
    if (!adminUser) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }
    if (adminUser.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    await connectDB();
    const { id } = await params;

    // Get user details
    const user = await User.findById(id).select('-password');
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's orders with populated product details
    const orders = await Order.find({ userId: id })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    // Calculate order statistics
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const completedOrders = orders.filter(order => order.orderStatus === 'delivered').length;
    const pendingOrders = orders.filter(order => order.orderStatus === 'placed').length;

    return Response.json({
      user,
      orders,
      statistics: {
        totalOrders,
        totalSpent,
        completedOrders,
        pendingOrders,
      }
    });
  } catch (error) {
    console.error('User details fetch error:', error);
    return Response.json({ error: 'Failed to fetch user details' }, { status: 500 });
  }
}