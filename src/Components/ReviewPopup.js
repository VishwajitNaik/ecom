'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const ReviewPopup = ({ isOpen, onClose, unreviewedProducts, onReviewSubmitted }) => {
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const currentProduct = unreviewedProducts[currentProductIndex];

  useEffect(() => {
    if (isOpen && currentProduct) {
      setRating(0);
      setReviewText('');
      setHoveredRating(0);
    }
  }, [isOpen, currentProduct]);

  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

  const handleStarHover = (starValue) => {
    setHoveredRating(starValue);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const submitReview = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/reviews/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: currentProduct.productId,
          rating,
          reviewText: reviewText.trim(),
          orderId: currentProduct.orderId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Review submitted successfully!');

        // Move to next product or close
        if (currentProductIndex < unreviewedProducts.length - 1) {
          setCurrentProductIndex(currentProductIndex + 1);
          setRating(0);
          setReviewText('');
        } else {
          onReviewSubmitted();
          onClose();
        }
      } else {
        toast.error(data.error || 'Failed to submit review');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const skipReview = () => {
    if (currentProductIndex < unreviewedProducts.length - 1) {
      setCurrentProductIndex(currentProductIndex + 1);
      setRating(0);
      setReviewText('');
    } else {
      onClose();
    }
  };

  const closePopup = () => {
    // Mark that we've shown the review popup for these products
    localStorage.setItem('reviewPopupShown', Date.now().toString());
    onClose();
  };

  if (!isOpen || !currentProduct) return null;

  return (
    <div className="fixed inset-0 text-gray-800 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full relative overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⭐</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Share Your Experience</h2>
          <p className="text-blue-100 text-sm">
            Help others by reviewing products you've purchased
          </p>
          {unreviewedProducts.length > 1 && (
            <p className="text-blue-200 text-xs mt-2">
              Product {currentProductIndex + 1} of {unreviewedProducts.length}
            </p>
          )}
        </div>

        <div className="p-6">
          {/* Product Info */}
          <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-xl">
            <img
              src={currentProduct.productImage || 'https://via.placeholder.com/60x60?text=Product'}
              alt={currentProduct.productName}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-sm">
                {currentProduct.productName}
              </h3>
              <p className="text-gray-600 text-xs">
                Purchased on {new Date(currentProduct.purchaseDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Rating Stars */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              How would you rate this product?
            </label>
            <div className="flex justify-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                  className="text-3xl transition-all duration-200 hover:scale-110"
                >
                  <span
                    className={`${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    } drop-shadow-sm`}
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
            <div className="text-center mt-2">
              <span className="text-sm text-gray-600">
                {rating > 0 && (
                  <>
                    {rating === 1 && 'Poor'}
                    {rating === 2 && 'Fair'}
                    {rating === 3 && 'Good'}
                    {rating === 4 && 'Very Good'}
                    {rating === 5 && 'Excellent'}
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Review Text */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Share your thoughts (Optional)
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell others about your experience with this product..."
              rows="3"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              maxLength="500"
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {reviewText.length}/500
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={skipReview}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              disabled={isSubmitting}
            >
              {currentProductIndex < unreviewedProducts.length - 1 ? 'Skip' : 'Maybe Later'}
            </button>
            <button
              onClick={submitReview}
              disabled={rating === 0 || isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 transform hover:scale-105 disabled:scale-100"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                'Submit Review'
              )}
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={closePopup}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-xl transition-colors"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Progress indicator for multiple products */}
        {unreviewedProducts.length > 1 && (
          <div className="px-6 pb-4">
            <div className="flex space-x-2">
              {unreviewedProducts.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                    index < currentProductIndex
                      ? 'bg-green-500'
                      : index === currentProductIndex
                      ? 'bg-blue-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewPopup;