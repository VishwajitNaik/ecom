import mongoose from 'mongoose';

const productDetailsSchema = new mongoose.Schema({
  productType: {
    type: String,
    required: true,
    enum: ['single', 'pack'],
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'productTypeModel',
  },
  productTypeModel: {
    type: String,
    required: true,
    enum: ['Product', 'ProductPack'],
  },
  about: {
    type: String,
    required: true,
  },
  info: {
    type: String,
    required: true,
  },
  gradients: [{
    type: String,
    required: true,
  }],
  additionalImages: [{
    type: String,
    required: true,
  }],
  poweredBy: {
    type: String,
    required: true,
  },
  opinion: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Compound index to ensure one detail record per product
productDetailsSchema.index({ productId: 1, productType: 1 }, { unique: true });

const ProductDetails = mongoose.models.ProductDetails || mongoose.model('ProductDetails', productDetailsSchema);

export default ProductDetails;