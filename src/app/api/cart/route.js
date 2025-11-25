import connectDB from '../../../dbconfig/dbconfig';
import Cart from '../../../models/cart';
import Product from '../../../models/products';
import ProductPack from '../../../models/productPack';
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
    const { userId, productId, quantity = 1, itemType = 'product' } = await request.json();

    // Check if already in cart - handle both old and new formats
    let item;
    if (itemType === 'product') {
      // For products, check both old and new format
      item = await Cart.findOne({
        userId,
        $or: [
          { itemId: productId, itemType: 'product' },
          { productId: productId, $or: [{ itemType: { $exists: false } }, { itemType: 'product' }] }
        ]
      });
    } else {
      // For product packs, use new format
      item = await Cart.findOne({ userId, itemId: productId, itemType });
    }

    if (item) {
      item.quantity += quantity;
      // Migrate old format to new format if needed
      if (!item.itemId && item.productId) {
        item.itemId = item.productId;
        item.itemType = itemType;
      }
      await item.save();
      return Response.json({ message: 'Quantity updated', item });
    }

    // Add new item
    item = await Cart.create({
      userId,
      itemId: productId,
      itemType,
      quantity,
      // Keep old field for backward compatibility
      productId: itemType === 'product' ? productId : undefined,
    });

    return Response.json({ message: 'Added to cart', item });
  } catch (error) {
    console.error('Cart API Error:', error);
    return Response.json({ error: 'Failed to add to cart', details: error.message }, { status: 500 });
  }
}