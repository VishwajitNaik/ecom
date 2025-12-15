import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return Response.json({ error: "Phone number is required" }, { status: 400 });
    }

    // Format phone number to E.164 format if needed
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: formattedPhone,
        channel: "sms",
      });

    return Response.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return Response.json({ error: error.message || "Failed to send OTP" }, { status: 500 });
  }
}
