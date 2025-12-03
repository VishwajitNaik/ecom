import connectDB from '../../../dbconfig/dbconfig';
import Order from '../../../models/order';
import User from '../../../models/user';
import { verifyToken, getTokenFromRequest } from '../../../lib/verifyToken';

export async function GET(request) {
  try {
    // If client provides a guestId header, return orders for that guest
    // without requiring a token (guest checkout flows).
    const guestIdHeader = request.headers.get('x-guest-id');
    await connectDB();
    if (guestIdHeader) {
      const orders = await Order.find({ guestId: guestIdHeader }).sort({ createdAt: -1 });

      // Manually populate items based on itemType (same as below)
      const populatedOrders = await Promise.all(
        orders.map(async (order) => {
          const populatedItems = await Promise.all(
            order.items.map(async (item) => {
              let populatedItem = item.toObject();
              if (item.itemType === 'productPack') {
                const ProductPack = (await import('../../../models/productPack')).default;
                const productPack = await ProductPack.findById(item.itemId).populate('productId');
                populatedItem.productData = productPack;
              } else {
                const Product = (await import('../../../models/products')).default;
                const product = await Product.findById(item.itemId);
                populatedItem.productData = product;
              }
              return populatedItem;
            })
          );
          return {
            ...order.toObject(),
            items: populatedItems
          };
        })
      );

      return Response.json(populatedOrders);
    }

    // Otherwise require token-based user orders
    const token = getTokenFromRequest(request);
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = verifyToken(token);
    if (!user) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Try to fetch user's phone from DB to match orders that were created as guests
    let purchaserPhone = null;
    try {
      const purchaser = await User.findById(user.id);
      purchaserPhone = purchaser?.phone || null;
    } catch (e) {
      console.error('Failed to lookup purchaser phone:', e);
    }

    // Build OR clauses dynamically: userId, buyerPhone
    const orClauses = [{ userId: user.id }];
    if (purchaserPhone) orClauses.push({ buyerPhone: purchaserPhone });

    const query = { $or: orClauses };

    const orders = await Order.find(query).sort({ createdAt: -1 });

    // Manually populate items based on itemType
    const populatedOrders = await Promise.all(
      orders.map(async (order) => {
        const populatedItems = await Promise.all(
          order.items.map(async (item) => {
            let populatedItem = item.toObject();
            if (item.itemType === 'productPack') {
              const ProductPack = (await import('../../../models/productPack')).default;
              const productPack = await ProductPack.findById(item.itemId).populate('productId');
              populatedItem.productData = productPack;
            } else {
              const Product = (await import('../../../models/products')).default;
              const product = await Product.findById(item.itemId);
              populatedItem.productData = product;
            }
            return populatedItem;
          })
        );
        return {
          ...order.toObject(),
          items: populatedItems
        };
      })
    );

    return Response.json(populatedOrders);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}