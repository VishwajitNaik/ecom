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

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const updateData = await request.json();

    // Calculate total price if price-related fields are being updated
    if (updateData.priceInRupee || updateData.quantity || updateData.discount || updateData.shippingPrice) {
      const pack = await ProductPack.findById(id);
      if (pack) {
        const priceInRupee = updateData.priceInRupee || pack.priceInRupee;
        const quantity = updateData.quantity || pack.quantity;
        const discount = updateData.discount || pack.discount;
        const shippingPrice = updateData.shippingPrice || pack.shippingPrice;
        updateData.totalPrice = (priceInRupee * quantity) - discount + shippingPrice;
      }
    }

    const updatedProductPack = await ProductPack.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('productId');

    if (!updatedProductPack) {
      return Response.json({ error: 'Product pack not found' }, { status: 404 });
    }

    return Response.json({
      message: 'Product pack updated successfully',
      productPack: updatedProductPack
    });
  } catch (error) {
    console.error('Product pack update error:', error);
    return Response.json({ error: 'Failed to update product pack' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const deletedProductPack = await ProductPack.findByIdAndDelete(id);
    if (!deletedProductPack) {
      return Response.json({ error: 'Product pack not found' }, { status: 404 });
    }

    return Response.json({
      message: 'Product pack deleted successfully',
      deletedProductPack
    });
  } catch (error) {
    console.error('Product pack delete error:', error);
    return Response.json({ error: 'Failed to delete product pack' }, { status: 500 });
  }
}
