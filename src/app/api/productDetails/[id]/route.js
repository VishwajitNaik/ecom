import { NextResponse } from 'next/server';
import connectDB from '../../../../dbconfig/dbconfig';
import ProductDetails from '../../../../models/productDetails';
import Product from '../../../../models/products';
import ProductPack from '../../../../models/productPack';

await connectDB();

// GET - Fetch specific product details
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const productDetails = await ProductDetails.findById(id);

    if (!productDetails) {
      return NextResponse.json(
        { success: false, error: 'Product details not found' },
        { status: 404 }
      );
    }

    // Populate manually based on product type
    const populatedDetail = productDetails.toObject();
    if (productDetails.productTypeModel === 'Product') {
      const product = await Product.findById(productDetails.productId);
      populatedDetail.productId = product;
    } else if (productDetails.productTypeModel === 'ProductPack') {
      const productPack = await ProductPack.findById(productDetails.productId);
      populatedDetail.productId = productPack;
    }

    return NextResponse.json({
      success: true,
      productDetails: populatedDetail,
    });
  } catch (error) {
    console.error('Error fetching product details:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product details' },
      { status: 500 }
    );
  }
}

// PUT - Update product details
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { about, info, gradients, additionalImages, poweredBy, opinion } = body;

    // Validate required fields
    if (!about || !info || !gradients || !additionalImages || !poweredBy || !opinion) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    const productDetails = await ProductDetails.findByIdAndUpdate(
      id,
      {
        about,
        info,
        gradients,
        additionalImages,
        poweredBy,
        opinion,
      },
      { new: true }
    );

    if (!productDetails) {
      return NextResponse.json(
        { success: false, error: 'Product details not found' },
        { status: 404 }
      );
    }

    // Populate manually based on product type
    const populatedDetail = productDetails.toObject();
    if (productDetails.productTypeModel === 'Product') {
      const product = await Product.findById(productDetails.productId);
      populatedDetail.productId = product;
    } else if (productDetails.productTypeModel === 'ProductPack') {
      const productPack = await ProductPack.findById(productDetails.productId);
      populatedDetail.productId = productPack;
    }

    return NextResponse.json({
      success: true,
      message: 'Product details updated successfully',
      productDetails: populatedDetail,
    });
  } catch (error) {
    console.error('Error updating product details:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product details' },
      { status: 500 }
    );
  }
}

// DELETE - Delete product details
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const productDetails = await ProductDetails.findByIdAndDelete(id);

    if (!productDetails) {
      return NextResponse.json(
        { success: false, error: 'Product details not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product details deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product details:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product details' },
      { status: 500 }
    );
  }
}