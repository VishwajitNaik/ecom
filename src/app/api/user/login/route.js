import connectDB from '../../../../dbconfig/dbconfig';
import User from '../../../../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    await connectDB();
    const { phone, password } = await request.json();

    // Find user
    const user = await User.findOne({ phone });
    if (!user) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return Response.json({ message: 'Login successful', token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone } });
  } catch (error) {
    return Response.json({ error: 'Login failed' }, { status: 500 });
  }
}