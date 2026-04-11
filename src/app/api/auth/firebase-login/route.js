import admin from "firebase-admin";
import jwt from "jsonwebtoken";
import connectDB from "@/dbconfig/dbconfig";
import User from "@/models/user";

export async function POST(req) {
  const { token } = await req.json();

  const decoded = await admin.auth().verifyIdToken(token);
  const phone = decoded.phone_number;

  await connectDB();

  let user = await User.findOne({ phone });

  if (!user) {
    user = await User.create({ phone });
  }

  const jwtToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return Response.json({
    success: true,
    token: jwtToken,
    user,
  });
}