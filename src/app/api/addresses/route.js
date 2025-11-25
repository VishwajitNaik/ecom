import connectDB from '../../../dbconfig/dbconfig';
import Address from '../../../models/address';
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

    await connectDB();
    const addresses = await Address.find({ userId: user.id }).sort({ createdAt: -1 });
    return Response.json(addresses);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch addresses' }, { status: 500 });
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
    const addressData = await request.json();

    // If setting as default, unset other defaults
    if (addressData.isDefault) {
      await Address.updateMany({ userId: user.id }, { isDefault: false });
    }

    const address = await Address.create({ ...addressData, userId: user.id });
    return Response.json(address);
  } catch (error) {
    return Response.json({ error: 'Failed to create address' }, { status: 500 });
  }
}