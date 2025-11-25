import connectDB from '../../../dbconfig/dbconfig';
import Cart from '../../../models/cart';
import { verifyToken, getTokenFromRequest } from '../../../lib/verifyToken';

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
    const { userId, productId, quantity = 1 } = await request.json();

    // Check if already in cart
    let item = await Cart.findOne({ userId, productId });

    if (item) {
      item.quantity += quantity;
      await item.save();
      return Response.json({ message: 'Quantity updated', item });
    }

    // Add new item
    item = await Cart.create({
      userId,
      productId,
      quantity,
    });

    return Response.json({ message: 'Added to cart', item });
  } catch (error) {
    return Response.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}