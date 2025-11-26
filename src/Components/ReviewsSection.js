'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import ReviewForm from './ReviewForm';
import { getUserFromToken } from '../lib/getUser';

const ReviewsSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [ratingDistribution, setRatingDistribution] = useState({});
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const sectionRef = useRef(null);

  useEffect(() => {
    fetchReviews();
    checkReviewEligibility();
  }, [productId]);

  useEffect(() => {
    if (!loading && sectionRef.current) {
      gsap.fromTo(sectionRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [loading]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews/by-product/${productId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
        setRatingDistribution(data.ratingDistribution);
        setTotalReviews(data.totalReviews);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkReviewEligibility = async () => {
    const user = getUserFromToken();
    console.log('Checking review eligibility for product:', productId, 'user:', user);
    if (!user) {
      console.log('No user found, cannot review');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/reviews/can-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();
      console.log('Review eligibility response:', data);
      setCanReview(data.canReview);
    } catch (error) {
      console.error('Failed to check review eligibility:', error);
    }
  };

  const handleReviewSubmitted = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
    setTotalReviews(prev => prev + 1);
    setCanReview(false);
    fetchReviews(); // Refresh to get updated rating distribution
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'recent':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const averageRating = totalReviews > 0
    ? (Object.entries(ratingDistribution).reduce((sum, [rating, count]) => sum + (rating * count), 0) / totalReviews).toFixed(1)
    : 0;

  const renderStars = (rating, size = 'text-lg') => {
    return (
      <div className={`flex ${size}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const RatingBar = ({ rating, count, total }) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <div className="flex items-center space-x-3 text-sm">
        <span className="w-8 text-gray-600">{rating}★</span>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="w-8 text-gray-600 text-right">{count}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div ref={sectionRef} className="py-8 border-t text-gray-800 border-gray-200">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Customer Reviews</h2>
          {canReview && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
            >
              Write a Review
            </button>
          )}
        </div>

        {/* Rating Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Average Rating */}
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="text-5xl font-bold text-gray-800 mb-2">{averageRating}</div>
            {renderStars(Math.round(averageRating))}
            <p className="text-gray-600 mt-2">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <RatingBar
                key={rating}
                rating={rating}
                count={ratingDistribution[rating] || 0}
                total={totalReviews}
              />
            ))}
          </div>
        </div>

        {/* Sort Options */}
        {reviews.length > 1 && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Most Recent</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {sortedReviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No reviews yet</h3>
              <p className="text-gray-500">Be the first to review this product!</p>
            </div>
          ) : (
            sortedReviews.map((review, index) => (
              <div
                key={review._id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {review.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{review.user.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-600 font-medium">
                      {review.rating}/5
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {review.images.map((image, imgIndex) => (
                      <div key={imgIndex} className="relative">
                        <img
                          src={image}
                          alt={`Review image ${imgIndex + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border cursor-pointer hover:scale-105 transition-transform duration-200"
                          onClick={() => window.open(image, '_blank')}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          productId={productId}
          onReviewSubmitted={handleReviewSubmitted}
          onClose={() => setShowReviewForm(false)}
        />
      )}
    </>
  );
};

export default ReviewsSection;