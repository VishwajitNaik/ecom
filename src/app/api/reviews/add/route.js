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
    const { productId, rating, comment, images } = await request.json();

    // Verify user has purchased and received the product
    const order = await Order.findOne({
      userId: user.id,
      'items.itemId': productId,
      orderStatus: { $regex: /^delivered$/i } // Case-insensitive match
    });

    if (!order) {
      return Response.json({
        error: 'You can only review products you have purchased and received'
      }, { status: 403 });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      userId: user.id,
      productId: productId
    });

    if (existingReview) {
      return Response.json({
        error: 'You have already reviewed this product'
      }, { status: 400 });
    }

    // Create the review
    const review = new Review({
      userId: user.id,
      productId,
      rating: parseInt(rating),
      comment,
      images: images || [],
    });

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