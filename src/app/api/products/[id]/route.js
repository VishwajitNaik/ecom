import connectDB from '../../../../dbconfig/dbconfig';
import Product from '../../../../models/products';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const product = await Product.findById(id);
    console.log("Product Info", product);
    
    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    return Response.json(product);
  } catch (error) {
    console.error('Product fetch error:', error);
    return Response.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}