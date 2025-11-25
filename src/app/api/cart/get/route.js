import connectDB from '../../../../dbconfig/dbconfig';
import Cart from '../../../../models/cart';
import Product from '../../../../models/products';
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
    const { userId } = await request.json();

    const cartItems = await Cart.find({ userId }).populate('productId');

    return Response.json(cartItems);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}