import connectDB from '../../../dbconfig/dbconfig';
import ProductPack from '../../../models/productPack';
import Product from '../../../models/products'; // Import to register the model
import { verifyToken, getTokenFromRequest } from '../../../lib/verifyToken';

export async function GET(request) {
  try {
    await connectDB();
    const productPacks = await ProductPack.find({}).populate('productId');
    return Response.json(productPacks);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch product packs' }, { status: 500 });
  }
}

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

    await connectDB();
    const {
      productName,
      typeOfPack,
      dayOfDose,
      weightInLiter,
      priceInRupee,
      shippingPrice,
      usePerDay,
      quantity,
      discount,
      productId
    } = await request.json();

    // Calculate total price: (priceInRupee * quantity) - discount + shippingPrice
    const totalPrice = (priceInRupee * quantity) - discount + shippingPrice;

    const productPack = new ProductPack({
      productName,
      typeOfPack,
      dayOfDose,
      weightInLiter,
      priceInRupee,
      shippingPrice,
      usePerDay,
      quantity,
      discount,
      totalPrice,
      productId
    });

    await productPack.save();
    const populatedPack = await ProductPack.findById(productPack._id).populate('productId');

    return Response.json({ message: 'Product pack added successfully', productPack: populatedPack });
  } catch (error) {
    return Response.json({ error: 'Failed to add product pack' }, { status: 500 });
  }
}