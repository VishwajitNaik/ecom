import connectDB from '../../../../dbconfig/dbconfig';
import Coupon from '../../../../models/coupon';

export async function POST(request) {
  try {
    await connectDB();
    const { code } = await request.json();

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return Response.json({ error: 'Invalid coupon code' }, { status: 400 });
    }

    if (!coupon.isActive) {
      return Response.json({ error: 'Coupon is inactive' }, { status: 400 });
    }

    if (new Date() > new Date(coupon.expiryDate)) {
      return Response.json({ error: 'Coupon has expired' }, { status: 400 });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return Response.json({ error: 'Coupon usage limit reached' }, { status: 400 });
    }

    return Response.json({
      valid: true,
      discountPercentage: coupon.discountPercentage,
      couponId: coupon._id,
    });
  } catch (error) {
    return Response.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
}