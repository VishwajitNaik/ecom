import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false, // Temporarily optional for migration
  },
  itemType: {
    type: String,
    required: false, // Temporarily optional for migration
    default: 'product',
  },
  // Keep old field for backward compatibility
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
}, {
  timestamps: true,
});

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

export default Cart;