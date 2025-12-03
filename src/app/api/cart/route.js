import connectDB from '../../../dbconfig/dbconfig';
import Cart from '../../../models/cart';
import Product from '../../../models/products';
import ProductPack from '../../../models/productPack';
// No authentication required for adding to cart anymore. Frontend may send `userId` or `null`.

export async function POST(request) {
  try {
    await connectDB();
    const { userId, guestId, productId, quantity = 1, itemType = 'product' } = await request.json();

    // ownerQuery decides whether to use userId (logged-in) or guestId (guest browser)
    const ownerQuery = userId ? { userId } : (guestId ? { guestId } : {});

    // If no owner info provided, refuse to proceed to avoid creating global null-owner items
    if (!ownerQuery.userId && !ownerQuery.guestId) {
      return Response.json({ error: 'Missing userId or guestId' }, { status: 400 });
    }

    // Check if already in cart - handle both old and new formats
    let item;
    if (itemType === 'product') {
      // For products, check both old and new format
      item = await Cart.findOne({
        ...ownerQuery,
        $or: [
          { itemId: productId, itemType: 'product' },
          { productId: productId, $or: [{ itemType: { $exists: false } }, { itemType: 'product' }] }
        ]
      });
    } else {
      // For product packs, use new format
      item = await Cart.findOne({ ...ownerQuery, itemId: productId, itemType });
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
      userId: userId || undefined,
      guestId: guestId || undefined,
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