import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  manufacturedDate: {
    type: Date,
    required: true,
  },
  expireDate: {
    type: Date,
    required: true,
  },
  externalLinks: [{
    platform: {
      type: String,
      required: true,
      enum: ['amazon', 'flipkart', 'other']
    },
    url: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: 'URL must start with http:// or https://'
      }
    },
    price: {
      type: Number,
      min: 0
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;