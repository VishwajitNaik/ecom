import connectDB from '../../../../dbconfig/dbconfig';
import Carousel from '../../../../models/carousel';
import { verifyToken, getTokenFromRequest } from '../../../../lib/verifyToken';

export async function PUT(request, { params }) {
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
    const { id } = await params;
    const updateData = await request.json();

    const carousel = await Carousel.findByIdAndUpdate(id, updateData, { new: true });
    if (!carousel) {
      return Response.json({ error: 'Carousel not found' }, { status: 404 });
    }

    return Response.json(carousel);
  } catch (error) {
    return Response.json({ error: 'Failed to update carousel' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
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
    const { id } = await params;

    const carousel = await Carousel.findByIdAndDelete(id);
    if (!carousel) {
      return Response.json({ error: 'Carousel not found' }, { status: 404 });
    }

    return Response.json({ message: 'Carousel deleted' });
  } catch (error) {
    return Response.json({ error: 'Failed to delete carousel' }, { status: 500 });
  }
}