import connectDB from '../../../../dbconfig/dbconfig';
import Cart from '../../../../models/cart';
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
    const { cartId, quantity } = await request.json();

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      await Cart.findByIdAndDelete(cartId);
      return Response.json({ message: 'Item removed from cart' });
    }

    const item = await Cart.findById(cartId);
    if (!item || item.userId.toString() !== user.id) {
      return Response.json({ error: 'Item not found' }, { status: 404 });
    }

    item.quantity = quantity;
    await item.save();

    return Response.json({ message: 'Quantity updated', item });
  } catch (error) {
    return Response.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}