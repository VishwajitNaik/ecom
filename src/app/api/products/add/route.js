import connectDB from '../../../../dbconfig/dbconfig';
import Product from '../../../../models/products';
import { verifyToken, getTokenFromRequest } from '../../../../lib/verifyToken';

export async function POST(request) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = verifyToken(token);
    if (!user) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }
    if (user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    await connectDB();
    const { name, description, price, images, category, stock, manufacturedDate, expireDate, externalLinks } = await request.json();

    // Create product
    const product = new Product({ name, description, price, images, category, stock, manufacturedDate, expireDate, externalLinks });
    await product.save();

    return Response.json({ message: 'Product added successfully', product });
  } catch (error) {
    return Response.json({ error: 'Failed to add product' }, { status: 500 });
  }
}