import connectDB from '../../../../dbconfig/dbconfig';
import Address from '../../../../models/address';
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

    await connectDB();
    const { id } = await params;
    const updateData = await request.json();

    // If setting as default, unset other defaults
    if (updateData.isDefault) {
      await Address.updateMany({ userId: user.id, _id: { $ne: id } }, { isDefault: false });
    }

    const address = await Address.findOneAndUpdate(
      { _id: id, userId: user.id },
      updateData,
      { new: true }
    );

    if (!address) {
      return Response.json({ error: 'Address not found' }, { status: 404 });
    }

    return Response.json(address);
  } catch (error) {
    return Response.json({ error: 'Failed to update address' }, { status: 500 });
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

    await connectDB();
    const { id } = await params;

    const address = await Address.findOneAndDelete({ _id: id, userId: user.id });

    if (!address) {
      return Response.json({ error: 'Address not found' }, { status: 404 });
    }

    return Response.json({ message: 'Address deleted' });
  } catch (error) {
    return Response.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}