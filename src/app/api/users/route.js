import connectDB from '../../../dbconfig/dbconfig';
import User from '../../../models/user';
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
    const users = await User.find({}).select('-password'); // Exclude password field

    return Response.json(users);
  } catch (error) {
    console.error('Users fetch error:', error);
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}