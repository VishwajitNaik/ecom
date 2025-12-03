import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  guestId: {
    type: String,
    required: false,
    index: true,
  },
  items: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      itemType: {
        type: String,
        enum: ['product', 'productPack'],
        default: 'product',
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  address: {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    house: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
  },
  paymentMethod: {
    type: String,
    required: true, // COD or Razorpay
  },
  paymentId: {
    type: String, // Razorpay payment ID
  },
  orderId: {
    type: String, // Razorpay order ID
  },
  paymentStatus: {
    type: String,
    default: 'pending', // success / pending
  },
  orderStatus: {
    type: String,
    default: 'placed', // placed / shipped / delivered
  },
  subtotal: {
    type: Number,
    required: true,
  },
  gst: {
    type: Number,
    required: true,
  },
  delivery: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  // Phone number of the purchaser (verified via OTP when available).
  // This helps identify orders when `guestId` changes.
  buyerPhone: {
    type: String,
    required: false,
    index: true,
  },
}, {
  timestamps: true,
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;