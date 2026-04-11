import connectDB from '../../../../dbconfig/dbconfig';
import Visitor from '../../../../models/visitor';

export async function POST(request) {
  try {
    await connectDB();
    const { name, phone, address } = await request.json();

    if (!name || !phone || !address) {
      return Response.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Create new visitor record
    const visitor = await Visitor.create({
      name,
      phone,
      address,
    });

    return Response.json({ success: true, visitor });
  } catch (error) {
    console.error('Store visitor error:', error);
    return Response.json({ error: 'Failed to store visitor data', details: error.message }, { status: 500 });
  }
}
