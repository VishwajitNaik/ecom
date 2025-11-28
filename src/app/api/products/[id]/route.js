import connectDB from '../../../../dbconfig/dbconfig';
import Product from '../../../../models/products';
import { verifyToken, getTokenFromRequest } from '../../../../lib/verifyToken';

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

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    // Verify admin access
    const token = getTokenFromRequest(request);
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = verifyToken(token);
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, price, images, category, stock, manufacturedDate, expireDate, externalLinks } = body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        images,
        category,
        stock,
        manufacturedDate,
        expireDate,
        externalLinks,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    return Response.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Product update error:', error);
    return Response.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    // Verify admin access
    const token = getTokenFromRequest(request);
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = verifyToken(token);
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    return Response.json({
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Product delete error:', error);
    return Response.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}