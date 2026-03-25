import Razorpay from "razorpay";

let razorpayInstance = null;

const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_RjaoFSHdRr6Eja';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'Qn2bmaBV0eVyPguQwNNEdt2J';

    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return razorpayInstance;
};

export const razorpay = getRazorpayInstance();