'use client';

import { useState, useEffect } from 'react';
import ReviewPopup from './ReviewPopup';
import { getUserFromToken } from '../lib/getUser';

const ReviewPrompt = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreviewedProducts, setUnreviewedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkForUnreviewedProducts();
  }, []);

  const checkForUnreviewedProducts = async () => {
    const token = localStorage.getItem('token');
    const user = getUserFromToken();

    if (!token || !user) return;

    // Don't show review prompts to admin users
    if (user.role === 'admin') return;

    // Check if we've already shown the popup recently (within 24 hours)
    const lastShown = localStorage.getItem('reviewPopupShown');
    if (lastShown) {
      const hoursSinceShown = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60);
      if (hoursSinceShown < 24) {
        // Review popup cooldown active - don't show again within 24 hours
        return;
      }
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/reviews/unreviewed', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        if (data.unreviewedProducts && data.unreviewedProducts.length > 0) {
          setUnreviewedProducts(data.unreviewedProducts);
          setIsOpen(true);
        }
        // No unreviewed products - this is normal, no action needed
      } else {
        // Only log actual API errors, not "no products found"
        console.error('API Error checking unreviewed products:', data.error);
      }
    } catch (error) {
      console.error('Error checking unreviewed products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewSubmitted = () => {
    // Refresh the unreviewed products list
    checkForUnreviewedProducts();
  };

  const handleClose = () => {
    setIsOpen(false);
    setUnreviewedProducts([]);
  };

  return (
    <ReviewPopup
      isOpen={isOpen}
      onClose={handleClose}
      unreviewedProducts={unreviewedProducts}
      onReviewSubmitted={handleReviewSubmitted}
    />
  );
};

export default ReviewPrompt;