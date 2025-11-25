import connectDB from '../../../dbconfig/dbconfig';
import Order from '../../../models/order';
import { verifyToken, getTokenFromRequest } from '../../../lib/verifyToken';

export async function GET(request) {
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
    const orders = await Order.find({ userId: user.id })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    return Response.json(orders);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}