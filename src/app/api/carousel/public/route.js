import connectDB from '../../../../dbconfig/dbconfig';
import Carousel from '../../../../models/carousel';

export async function GET(request) {
  try {
    await connectDB();
    const carousels = await Carousel.find({ isActive: true }).sort({ order: 1 });
    return Response.json(carousels);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch carousels' }, { status: 500 });
  }
}