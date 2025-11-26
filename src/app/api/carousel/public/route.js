import connectDB from '../../../../dbconfig/dbconfig';
import Carousel from '../../../../models/carousel';

export async function GET(request) {
  try {
    await connectDB();
    const carousels = await Carousel.find({ isActive: true }).sort({ order: 1 });
    console.log('Fetched carousels:', carousels.length);
    return Response.json(carousels);
  } catch (error) {
    console.error('Carousel fetch error:', error);
    // Return empty array instead of error to prevent frontend crashes
    return Response.json([]);
  }
}