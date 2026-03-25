import connectDB from '../../../../../dbconfig/dbconfig';
import Review from '../../../../../models/review';
import User from '../../../../../models/user';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    // Get reviews with user information
    const reviews = await Review.find({
      productId: id,
      isApproved: true
    })
    .populate('userId', 'name')
    .sort({ createdAt: -1 })
    .limit(50); // Limit to prevent too many reviews

    // Calculate rating distribution
    const ratingDistribution = {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    };

    reviews.forEach(review => {
      ratingDistribution[review.rating] = (ratingDistribution[review.rating] || 0) + 1;
    });

    return Response.json({
      reviews: reviews.map(review => ({
        _id: review._id,
        rating: review.rating,
        comment: review.comment,
        images: review.images,
        createdAt: review.createdAt,
        user: {
          name: review.userId?.name || 'Anonymous'
        }
      })),
      ratingDistribution,
      totalReviews: reviews.length
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return Response.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}