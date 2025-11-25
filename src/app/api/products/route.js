import connectDB from '../../../dbconfig/dbconfig';
import Product from '../../../models/products';

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({});
    return Response.json(products);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}