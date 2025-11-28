import connectDB from '../../../../dbconfig/dbconfig';
import Order from '../../../../models/order';
import Review from '../../../../models/review';
import Product from '../../../../models/products'; // Import Product model for populate
import { verifyToken, getTokenFromRequest } from '../../../../lib/verifyToken';

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

    // Find all delivered orders for this user
    const deliveredOrders = await Order.find({
      userId: user.id,
      orderStatus: 'delivered'
    }).populate({
      path: 'items.itemId',
      model: 'Product' // This will work for both products and product packs
    });

    // Debug: console.log(`Found ${deliveredOrders.length} delivered orders for user ${user.id}`);

    const unreviewedProducts = [];

    for (const order of deliveredOrders) {
      for (const item of order.items) {
        // Check if this product has already been reviewed by this user
        const existingReview = await Review.findOne({
          userId: user.id,
          productId: item.itemId._id || item.itemId,
          orderId: order._id
        });

        if (!existingReview) {
          // Determine if it's a product pack or regular product
          const isProductPack = item.itemType === 'productPack';
          const productData = isProductPack ? item.itemId?.productId : item.itemId;

          if (productData) {
            unreviewedProducts.push({
              productId: productData._id,
              productName: productData.name,
              productImage: productData.images?.[0] || null,
              orderId: order._id,
              purchaseDate: order.createdAt,
              itemType: item.itemType,
              quantity: item.quantity,
              price: item.price
            });
          }
        }
      }
    }

    // Debug: console.log(`Returning ${unreviewedProducts.length} unreviewed products`);
    return Response.json({
      unreviewedProducts,
      totalCount: unreviewedProducts.length
    });

  } catch (error) {
    console.error('Error fetching unreviewed products:', error);
    return Response.json({ error: 'Failed to fetch unreviewed products' }, { status: 500 });
  }
}