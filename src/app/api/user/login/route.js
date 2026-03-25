import connectDB from '../../../../dbconfig/dbconfig';
import User from '../../../../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await connectDB();
    const { phone, password } = await request.json();

    // Find user
    const user = await User.findOne({ phone });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Create response with token
    const response = NextResponse.json({ message: 'Login successful', token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });

    // Set cookie for middleware to access
    response.cookies.set('token', token, {
      httpOnly: false,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
