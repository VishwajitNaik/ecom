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
    const orders = await Order.find({ userId: user.id }).sort({ createdAt: -1 });

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