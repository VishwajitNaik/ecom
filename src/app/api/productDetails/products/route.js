import { NextResponse } from 'next/server';
import connectDB from '../../../../dbconfig/dbconfig';
import Product from '../../../../models/products';
import ProductPack from '../../../../models/productPack';

await connectDB();

// GET - Fetch all products and product packs for selection
export async function GET(request) {
  try {
    // Fetch single products
    const products = await Product.find({})
      .select('name description price images category')
      .sort({ createdAt: -1 });

    // Fetch product packs
    const productPacks = await ProductPack.find({})
      .select('productName typeOfPack priceInRupee quantity productId')
      .populate('productId', 'name category')
      .sort({ createdAt: -1 });

    // Format the data for easy selection
    const formattedProducts = products.map(product => ({
      id: product._id,
      name: product.name,
      type: 'single',
      category: product.category,
      price: product.price,
      images: product.images,
      description: product.description,
    }));

    const formattedProductPacks = productPacks.map(pack => ({
      id: pack._id,
      name: `${pack.productId?.name || 'Unknown'} - ${pack.productName} (${pack.typeOfPack})`,
      type: 'pack',
      category: pack.productId?.category || 'Unknown',
      price: pack.priceInRupee,
      quantity: pack.quantity,
      productId: pack.productId?._id,
    }));

    return NextResponse.json({
      success: true,
      products: [...formattedProducts, ...formattedProductPacks],
    });
  } catch (error) {
    console.error('Error fetching products for selection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}