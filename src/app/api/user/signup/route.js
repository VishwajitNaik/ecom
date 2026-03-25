import connectDB from '../../../../dbconfig/dbconfig';
import User from '../../../../models/user';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    await connectDB();
    const { name, email, phone, password } = await request.json();

    // Check if user exists by phone
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return Response.json({ error: 'User with this phone already exists' }, { status: 400 });
    }

    // If email provided, check uniqueness
    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return Response.json({ error: 'User with this email already exists' }, { status: 400 });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({ name, email, phone, password: hashedPassword });
    await user.save();

    return Response.json({ message: 'User created successfully' });
  } catch (error) {
    return Response.json({ error: 'Failed to create user' }, { status: 500 });
  }
}