import connectDB from '../../../../dbconfig/dbconfig';
import Coupon from '../../../../models/coupon';
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

    const coupon = await Coupon.findByIdAndUpdate(id, updateData, { new: true });
    if (!coupon) {
      return Response.json({ error: 'Coupon not found' }, { status: 404 });
    }

    return Response.json(coupon);
  } catch (error) {
    return Response.json({ error: 'Failed to update coupon' }, { status: 500 });
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

    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      return Response.json({ error: 'Coupon not found' }, { status: 404 });
    }

    return Response.json({ message: 'Coupon deleted' });
  } catch (error) {
    return Response.json({ error: 'Failed to delete coupon' }, { status: 500 });
  }
}