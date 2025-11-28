import { NextResponse } from 'next/server';
import connectDB from '../../../../../dbconfig/dbconfig';
import ProductDetails from '../../../../../models/productDetails';
import Product from '../../../../../models/products';
import ProductPack from '../../../../../models/productPack';

await connectDB();

// GET - Fetch product details by product ID
export async function GET(request, { params }) {
  try {
    const { productId } = await params;

    // Try to find product details for this product ID
    const productDetails = await ProductDetails.findOne({
      productId: productId
    });

    if (!productDetails) {
      return NextResponse.json({
        success: true,
        productDetails: null,
        message: 'No additional details found for this product'
      });
    }

    // Populate the product information
    const populatedDetail = productDetails.toObject();
    if (productDetails.productTypeModel === 'Product') {
      const product = await Product.findById(productDetails.productId);
      populatedDetail.product = product;
    } else if (productDetails.productTypeModel === 'ProductPack') {
      const productPack = await ProductPack.findById(productDetails.productId);
      populatedDetail.product = productPack;
    }

    return NextResponse.json({
      success: true,
      productDetails: populatedDetail,
    });
  } catch (error) {
    console.error('Error fetching product details by product ID:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product details' },
      { status: 500 }
    );
  }
}