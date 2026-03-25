import mongoose from 'mongoose';

const productPackSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  typeOfPack: {
    type: String,
    required: true,
    enum: ['bottle', 'box', 'strip', 'packet', 'sachet', 'tube', 'jar', 'can'],
  },
  dayOfDose: {
    type: Number,
    required: true,
    min: 1,
  },
  weightInLiter: {
    type: String,
    required: true,
    enum: ['1', '500ml', '250ml', '100ml'],
  },
  priceInRupee: {
    type: Number,
    required: true,
    min: 0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  usePerDay: {
    type: String,
    required: true,
    enum: ['2 times', '3 times'],
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: false,
    min: 0,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
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
}, {
  timestamps: true,
});

const ProductPack = mongoose.models.ProductPack || mongoose.model('ProductPack', productPackSchema);

export default ProductPack;