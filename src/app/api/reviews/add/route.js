import connectDB from '../../../../dbconfig/dbconfig';
import Review from '../../../../models/review';
import Product from '../../../../models/products';
import Order from '../../../../models/order';
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
    const { productId, rating, reviewText, orderId } = await request.json();

    // Verify the order exists and belongs to the user
    const order = await Order.findOne({
      _id: orderId,
      userId: user.id,
      orderStatus: 'delivered'
    });

    if (!order) {
      return Response.json({
        error: 'Invalid order or product not delivered yet'
      }, { status: 403 });
    }

    // Check if this specific product is in the order
    const orderItem = order.items.find(item =>
      (item.itemId.toString() === productId.toString()) ||
      (item.itemId._id && item.itemId._id.toString() === productId.toString())
    );

    if (!orderItem) {
      return Response.json({
        error: 'Product not found in this order'
      }, { status: 403 });
    }

    // Try to find existing review for this order
    let review = await Review.findOne({
      userId: user.id,
      productId: productId,
      orderId: orderId
    });

    if (review) {
      // Update existing review
      review.rating = parseInt(rating);
      review.comment = reviewText || '';
      await review.save();
    } else {
      // Check for old reviews without orderId and update them
      const oldReview = await Review.findOne({
        userId: user.id,
        productId: productId,
        $or: [
          { orderId: { $exists: false } },
          { orderId: null }
        ]
      });

      if (oldReview) {
        // Update old review with orderId and new data
        oldReview.orderId = orderId;
        oldReview.rating = parseInt(rating);
        oldReview.comment = reviewText || '';
        await oldReview.save();
        review = oldReview;
      } else {
        // Create completely new review
        review = new Review({
          userId: user.id,
          productId,
          orderId,
          rating: parseInt(rating),
          comment: reviewText || '',
        });
        await review.save();
      }
    }

    await review.save();

    // Update product rating
    const allReviews = await Review.find({ productId, isApproved: true });
    const totalReviews = allReviews.length;
    const averageRating = totalReviews > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews
    });

    return Response.json({
      message: 'Review added successfully',
      review: {
        ...review.toObject(),
        user: { name: user.name }
      }
    });

  } catch (error) {
    console.error('Review creation error:', error);
    return Response.json({ error: 'Failed to add review' }, { status: 500 });
  }
}