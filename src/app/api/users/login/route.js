import connectDB from '../../../../dbconfig/dbconfig';
import User from '../../../../models/user';
import Order from '../../../../models/order';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    await connectDB();
    const { phone, uid, guestId } = await request.json();

    if (!phone || !uid) {
      return Response.json({ success: false, error: 'Missing phone or uid' }, { status: 400 });
    }

    let user = null;
    // Try to find by firebaseUid first
    user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      // Try to find by phone
      user = await User.findOne({ phone });
    }

    if (!user) {
      user = await User.create({ phone, firebaseUid: uid, createdAt: new Date() });
    } else if (!user.firebaseUid) {
      // Link firebaseUid if missing
      user.firebaseUid = uid;
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

      // If login was triggered from a guest session, associate any guest orders
      // with this newly linked user so they show up in My Orders.
      try {
        if (guestId) {
          await Order.updateMany(
            { guestId },
            { $set: { userId: user._id, buyerPhone: phone } }
          );
        }
      } catch (orderLinkErr) {
        console.error('Failed to link guest orders to user:', orderLinkErr);
      }

    return new Response(JSON.stringify({ success: true, userId: user._id, token }), {
      status: 200,
      headers: {
        'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=2592000`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ success: false, error: 'Login failed' }, { status: 500 });
  }
}
