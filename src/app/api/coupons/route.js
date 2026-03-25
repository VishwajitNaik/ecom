import connectDB from '../../../dbconfig/dbconfig';
import Coupon from '../../../models/coupon';
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
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    return Response.json(coupons);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch coupons' }, { status: 500 });
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
    const couponData = await request.json();
    const coupon = await Coupon.create(couponData);
    return Response.json(coupon);
  } catch (error) {
    return Response.json({ error: 'Failed to create coupon' }, { status: 500 });
  }
}