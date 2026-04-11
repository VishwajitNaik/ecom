import connectDB from '../../../../dbconfig/dbconfig';
import Coupon from '../../../../models/coupon';

export async function GET(request) {
  try {
    await connectDB();
    const now = new Date();
    const activeCoupons = await Coupon.find({
      isActive: true,
      expiryDate: { $gt: now }
    }).select('code discountPercentage expiryDate').sort({ createdAt: -1 });
    return Response.json(activeCoupons);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch active coupons' }, { status: 500 });
  }
}