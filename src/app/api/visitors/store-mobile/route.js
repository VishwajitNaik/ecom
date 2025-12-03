import connectDB from '../../../../dbconfig/dbconfig';
import VisitorMobile from '../../../../models/visitorMobile';

export async function POST(request) {
  try {
    await connectDB();
    const { phone, source, userId, name, email } = await request.json();

    if (!phone) {
      return Response.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Try to find existing visitor
    let visitor = await VisitorMobile.findOne({ phone });

    if (visitor) {
      // Update existing visitor
      visitor.visitCount += 1;
      visitor.lastVisit = new Date();
      if (userId && !visitor.userData.userId) {
        visitor.userData.userId = userId;
        visitor.userData.name = name;
        visitor.userData.email = email;
      }
      await visitor.save();
    } else {
      // Create new visitor record
      visitor = await VisitorMobile.create({
        phone,
        source: source || 'manual',
        visitCount: 1,
        userData: {
          userId: userId || null,
          name: name || null,
          email: email || null,
        },
      });
    }

    return Response.json({ success: true, visitor });
  } catch (error) {
    console.error('Store mobile error:', error);
    if (error.code === 11000) {
      // Duplicate key error - phone already exists, just update visit count
      const phone = error.keyValue?.phone;
      if (phone) {
        const visitor = await VisitorMobile.findOne({ phone });
        visitor.visitCount += 1;
        visitor.lastVisit = new Date();
        await visitor.save();
        return Response.json({ success: true, visitor });
      }
    }
    return Response.json({ error: 'Failed to store mobile number', details: error.message }, { status: 500 });
  }
}
