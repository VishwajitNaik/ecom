import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: false, // Making it optional for the popup
    trim: true,
  },
  images: [{
    type: String,
  }],
  isVerified: {
    type: Boolean,
    default: true, // Set to true if user has purchased the product
  },
  isApproved: {
    type: Boolean,
    default: true, // For admin moderation
  },
}, {
  timestamps: true,
});

// Compound index to ensure one review per user per product per order
// Temporarily removing unique constraint to handle migration
reviewSchema.index({ userId: 1, productId: 1, orderId: 1 }, { sparse: true });

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default Review;