import connectDB from '../../../../dbconfig/dbconfig';
import Order from '../../../../models/order';

export async function POST(req) {
  await connectDB();

  const body = await req.json();
  const order = await Order.create(body);

  return Response.json({ success: true, order });
}