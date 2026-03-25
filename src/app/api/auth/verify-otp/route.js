import twilio from "twilio";
import jwt from "jsonwebtoken";
import { NextResponse } from 'next/server';
import connectDB from "../../../../dbconfig/dbconfig";
import User from "../../../../models/user";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req) {
  try {
    const { phone, code } = await req.json();

    if (!phone || !code) {
      return NextResponse.json({ error: "Phone number and OTP code are required" }, { status: 400 });
    }

    // Format phone number to E.164 format if needed
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    // Verify OTP with Twilio
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: formattedPhone,
        code,
      });

    if (verification.status !== "approved") {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Check if user exists, if not create one
    let user = await User.findOne({ phone: formattedPhone });

    if (!user) {
      // Create new user
      user = new User({
        phone: formattedPhone,
        role: "user", // Default role
        createdAt: new Date(),
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        phone: user.phone,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Create response and set cookie
    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id,
        phone: user.phone,
        role: user.role
      }
    });

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
    console.error("Error verifying OTP:", error);
    return NextResponse.json({ error: error.message || "Failed to verify OTP" }, { status: 500 });
  }
}
