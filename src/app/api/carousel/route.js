import connectDB from '../../../dbconfig/dbconfig';
import Carousel from '../../../models/carousel';
import { verifyToken, getTokenFromRequest } from '../../../lib/verifyToken';

export async function GET(request) {
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
    const carousels = await Carousel.find({}).sort({ order: 1 });
    return Response.json(carousels);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch carousels' }, { status: 500 });
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
    if (user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    await connectDB();
    const carouselData = await request.json();
    const carousel = await Carousel.create(carouselData);
    return Response.json(carousel);
  } catch (error) {
    return Response.json({ error: 'Failed to create carousel' }, { status: 500 });
  }
}