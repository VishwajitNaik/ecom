import connectDB from '../../../../dbconfig/dbconfig';
import Cart from '../../../../models/cart';
export async function POST(request) {
  try {
    await connectDB();
    const { cartId, quantity } = await request.json();

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      await Cart.findByIdAndDelete(cartId);
      return Response.json({ message: 'Item removed from cart' });
    }

    const item = await Cart.findById(cartId);
    if (!item) {
      return Response.json({ error: 'Item not found' }, { status: 404 });
    }

    item.quantity = quantity;
    await item.save();

    return Response.json({ message: 'Quantity updated', item });
  } catch (error) {
    return Response.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}