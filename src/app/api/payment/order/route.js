import { razorpay } from "../../../../lib/razorpay";

export async function POST(req) {
  try {
    const { amount } = await req.json();

    console.log('Creating Razorpay order for amount:', amount);
    console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID || 'Using fallback');
    console.log('RAZORPAY_KEY_SECRET exists:', !!process.env.RAZORPAY_KEY_SECRET || 'Using fallback');

    if (!amount || amount <= 0) {
      return Response.json({ success: false, error: 'Invalid amount' }, { status: 400 });
    }

    const options = {
      amount: Math.round(amount * 100), // convert to paisa and ensure integer
      currency: "INR",
      receipt: "order_rcpt_" + Date.now(),
    };

    console.log('Razorpay options:', options);

    const order = await razorpay.orders.create(options);

    console.log('Razorpay order created:', order);

    return Response.json({
      success: true,
      order,
    });

  } catch (e) {
    console.error('Razorpay order creation error:', e);
    return Response.json({ success: false, error: e.message }, { status: 500 });
  }
}