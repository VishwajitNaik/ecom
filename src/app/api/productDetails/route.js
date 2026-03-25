import { NextResponse } from 'next/server';
import connectDB from '../../../dbconfig/dbconfig';
import ProductDetails from '../../../models/productDetails';
import Product from '../../../models/products';
import ProductPack from '../../../models/productPack';

await connectDB();

// GET - Fetch all product details with populated product info
export async function GET(request) {
  try {
    // First get all product details
    const productDetailsRaw = await ProductDetails.find({}).sort({ createdAt: -1 });

    // Then populate each one individually based on its type
    const populatedDetails = await Promise.all(
      productDetailsRaw.map(async (detail) => {
        const populatedDetail = detail.toObject();
        if (detail.productTypeModel === 'Product') {
          const product = await Product.findById(detail.productId);
          populatedDetail.productId = product;
        } else if (detail.productTypeModel === 'ProductPack') {
          const productPack = await ProductPack.findById(detail.productId);
          populatedDetail.productId = productPack;
        }
        return populatedDetail;
      })
    );

    return NextResponse.json({
      success: true,
      productDetails: populatedDetails,
    });
  } catch (error) {
    console.error('Error fetching product details:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product details' },
      { status: 500 }
    );
  }
}

// POST - Create new product details
export async function POST(request) {
  try {
    const body = await request.json();
    const { productType, productId, about, info, gradients, additionalImages, poweredBy, opinion } = body;

    // Validate required fields
    if (!productType || !productId || !about || !info || !gradients || !additionalImages || !poweredBy || !opinion) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate product type
    if (!['single', 'pack'].includes(productType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product type' },
        { status: 400 }
      );
    }

    // Check if product exists
    const Model = productType === 'single' ? Product : ProductPack;
    const productExists = await Model.findById(productId);

    if (!productExists) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if details already exist for this product
    const existingDetails = await ProductDetails.findOne({ productId, productType });
    if (existingDetails) {
      return NextResponse.json(
        { success: false, error: 'Product details already exist for this product' },
        { status: 400 }
      );
    }

    // Create product details
    const productDetails = new ProductDetails({
      productType,
      productId,
      productTypeModel: productType === 'single' ? 'Product' : 'ProductPack',
      about,
      info,
      gradients,
      additionalImages,
      poweredBy,
      opinion,
    });

    await productDetails.save();

    // Populate the product info before returning
    await productDetails.populate({
      path: 'productId',
      model: productType === 'single' ? Product : ProductPack
    });

    return NextResponse.json({
      success: true,
      message: 'Product details created successfully',
      productDetails,
    });
  } catch (error) {
    console.error('Error creating product details:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product details' },
      { status: 500 }
    );
  }
}