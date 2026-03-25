import connectDB from '../../../dbconfig/dbconfig';
import Product from '../../../models/products';

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({});
    return Response.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return Response.json({ error: 'Failed to fetch products', details: error.message }, { status: 500 });
  }
}