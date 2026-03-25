import { NextResponse } from "next/server";
import { adminMessaging } from "../../../../lib/firebaseAdmin";
import connectDB from "../../../../dbconfig/dbconfig";
import AdminToken from "../../../../models/adminToken";

export async function POST(req) {
  const { token, title, body } = await req.json();

  try {
    if (token) {
      // Send to specific token
      await adminMessaging.send({
        token,
        notification: { title, body },
      });
    } else {
      // Send to all admin tokens
      await connectDB();
      const adminTokens = await AdminToken.find({ isActive: true });

      const results = await Promise.all(
        adminTokens.map(async (adminToken) => {
          try {
            await adminMessaging.send({
              token: adminToken.fcmToken,
              notification: { title, body },
            });
            return { success: true };
          } catch (err) {
            console.error("FCM error for token:", adminToken.fcmToken, err);
            return { success: false, error: err.message };
          }
        })
      );

      const successCount = results.filter(r => r.success).length;
      if (successCount === 0) {
        return NextResponse.json({ success: false, error: "No notifications sent" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("FCM error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
