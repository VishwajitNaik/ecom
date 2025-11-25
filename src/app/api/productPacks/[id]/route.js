import connectDB from '../../../../dbconfig/dbconfig';
import ProductPack from '../../../../models/productPack';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const productPack = await ProductPack.findById(id).populate('productId');
    if (!productPack) {
      return Response.json({ error: 'Product pack not found' }, { status: 404 });
    }

    return Response.json(productPack);
  } catch (error) {
    console.error('Product pack fetch error:', error);
    return Response.json({ error: 'Failed to fetch product pack' }, { status: 500 });
  }
}